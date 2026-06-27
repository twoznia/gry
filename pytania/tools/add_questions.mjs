#!/usr/bin/env node
/**
 * add_questions.mjs — generuje pytania AI i dopisuje je BEZPOŚREDNIO do
 * pytania/dane/pytania.csv (jedyne źródło prawdy używane przez grę).
 *
 * Najważniejsze cechy:
 *   • --count N        — ile pytań dodać w jednym przebiegu (np. 200 dziennie)
 *   • zbalansowany rozdział pytań na kategorie/subkategorie (najpierw te
 *     najsłabiej reprezentowane, żeby korpus nie puchł w jednym miejscu)
 *   • generowanie wsadowe (kilka pytań na jedno zapytanie API) — szybciej i taniej
 *   • twarda deduplikacja względem CAŁEGO pliku CSV + pytań z bieżącego przebiegu
 *   • walidacja długości / formatu / bezpieczeństwa CSV (brak ';' i nowych linii)
 *
 * Użycie:
 *   node pytania/tools/add_questions.mjs --count 200
 *   node pytania/tools/add_questions.mjs --count 50 --category "Sport"
 *   node pytania/tools/add_questions.mjs --count 20 --level trudne --dry-run
 *
 * Zmienne środowiskowe:
 *   OPENAI_API_KEY   wymagany (chyba że --dry-run)
 *   OPENAI_MODEL     opcjonalny, domyślnie: gpt-4o-mini
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH  = resolve(__dirname, '../dane/pytania.csv');

const VALID_LEVELS  = ['łatwe', 'średnie', 'trudne', 'bardzo trudne'];
const DEFAULT_COUNT = 20;
const DEFAULT_BATCH = 10;   // ile pytań prosić w jednym zapytaniu API
const MAX_ATTEMPTS  = 3;    // ponowienia na cel

// Separator klucza kategoria+subkategoria — znak sterujący nieobecny w danych.
const SEP = '\u0001';
function subKey(category, subcategory) { return category + SEP + subcategory; }

// ── Pomoc ─────────────────────────────────────────────────────────────────────

function showHelp() {
  console.log(`Użycie: node pytania/tools/add_questions.mjs --count <N> [opcje]

Opcje:
  --count <N>        Ile pytań dodać w tym przebiegu (domyślnie: ${DEFAULT_COUNT})
  --category <nazwa> Ogranicz do jednej kategorii (domyślnie: rozłóż na wszystkie)
  --level <poziom>   Wymuś poziom: łatwe|średnie|trudne|bardzo trudne
                     (domyślnie: losuj proporcjonalnie do istniejących pytań)
  --batch <N>        Ile pytań na jedno zapytanie API (domyślnie: ${DEFAULT_BATCH})
  --dry-run          Pokaż wynik bez zapisu do CSV
  --help             Wyświetl tę pomoc

Zmienne środowiskowe:
  OPENAI_API_KEY     Klucz API OpenAI (wymagany, chyba że --dry-run)
  OPENAI_MODEL       Model (domyślnie: gpt-4o-mini)

Przykłady:
  node pytania/tools/add_questions.mjs --count 200
  node pytania/tools/add_questions.mjs --count 50 --category "Geografia i Turystyka"
  node pytania/tools/add_questions.mjs --count 20 --level łatwe --dry-run
`);
}

// ── Argumenty ─────────────────────────────────────────────────────────────────

function needValue(args, i, name) {
  if (i >= args.length) { console.error(`Błąd: ${name} wymaga wartości`); process.exit(1); }
  return args[i];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { count: DEFAULT_COUNT, category: null, level: null, batch: DEFAULT_BATCH, dryRun: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--count':    opts.count    = parseInt(needValue(args, ++i, '--count'), 10); break;
      case '--category': opts.category = needValue(args, ++i, '--category');            break;
      case '--level':    opts.level    = needValue(args, ++i, '--level');               break;
      case '--batch':    opts.batch    = parseInt(needValue(args, ++i, '--batch'), 10); break;
      case '--dry-run':  opts.dryRun   = true;                                          break;
      case '--help':
      case '-h':         showHelp(); process.exit(0);
      default:
        console.error(`Nieznany argument: ${args[i]}`);
        showHelp();
        process.exit(1);
    }
  }

  if (!Number.isInteger(opts.count) || opts.count < 1) {
    console.error('Błąd: --count musi być dodatnią liczbą całkowitą.'); process.exit(1);
  }
  if (!Number.isInteger(opts.batch) || opts.batch < 1) {
    console.error('Błąd: --batch musi być dodatnią liczbą całkowitą.'); process.exit(1);
  }
  if (opts.level && !VALID_LEVELS.includes(opts.level)) {
    console.error(`Błąd: nieprawidłowy poziom "${opts.level}". Dozwolone: ${VALID_LEVELS.join(', ')}`);
    process.exit(1);
  }
  return opts;
}

// ── CSV ───────────────────────────────────────────────────────────────────────

function normalize(text) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Wczytaj CSV → { rawText, rows:[{category,subcategory,level,question,...}] } */
function loadCsv() {
  if (!existsSync(CSV_PATH)) {
    console.error(`Błąd: nie znaleziono pliku CSV: ${CSV_PATH}`);
    process.exit(1);
  }
  const rawText = readFileSync(CSV_PATH, 'utf-8');
  const lines = rawText.split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {        // pomiń nagłówek
    const line = lines[i].replace(/\r$/, '');
    if (!line.trim()) continue;
    const cols = line.split(';');
    if (cols.length < 8) continue;
    const [category, subcategory, level, question, correct, wrong1, wrong2, wrong3] = cols;
    rows.push({ category, subcategory, level, question, correct, wrong1, wrong2, wrong3 });
  }
  return { rawText, rows };
}

// ── Plan rozdziału pytań ──────────────────────────────────────────────────────

/**
 * Zwraca listę celów [{category, subcategory, level, n}] sumujących się do count.
 * Strategia: najpierw subkategorie najsłabiej reprezentowane (wyrównywanie korpusu).
 */
function buildPlan(rows, count, categoryFilter, levelForce) {
  const subCount  = new Map();  // key -> liczba pytań
  const subLevels = new Map();  // key -> [poziomy...]
  const subMeta   = new Map();  // key -> {category, subcategory}
  const levelTally = new Map(); // poziom -> liczba (losowanie proporcjonalne)

  for (const r of rows) {
    if (categoryFilter && r.category !== categoryFilter) continue;
    const key = subKey(r.category, r.subcategory);
    subCount.set(key, (subCount.get(key) || 0) + 1);
    if (!subMeta.has(key)) subMeta.set(key, { category: r.category, subcategory: r.subcategory });
    if (!subLevels.has(key)) subLevels.set(key, []);
    if (r.level) {
      subLevels.get(key).push(r.level);
      levelTally.set(r.level, (levelTally.get(r.level) || 0) + 1);
    }
  }

  const keys = [...subCount.keys()];
  if (keys.length === 0) {
    console.error(categoryFilter
      ? `Błąd: brak istniejących pytań dla kategorii "${categoryFilter}".`
      : 'Błąd: pusty plik CSV — brak subkategorii do rozbudowy.');
    process.exit(1);
  }

  // Najpierw uzupełniamy tematy o najmniejszej liczbie pytań.
  keys.sort((a, b) => subCount.get(a) - subCount.get(b));

  // Rozdziel `count` rundami round-robin po posortowanych kluczach.
  const want = new Map();
  let assigned = 0;
  while (assigned < count) {
    for (const key of keys) {
      if (assigned >= count) break;
      want.set(key, (want.get(key) || 0) + 1);
      assigned++;
    }
  }

  const pickLevel = (key) => {
    if (levelForce) return levelForce;
    const local = subLevels.get(key);
    if (local && local.length) return local[Math.floor(Math.random() * local.length)];
    const pool = [...levelTally.entries()].flatMap(([lvl, n]) => Array(n).fill(lvl));
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : 'trudne';
  };

  return keys.filter(k => want.has(k)).map(key => {
    const { category, subcategory } = subMeta.get(key);
    return { category, subcategory, level: pickLevel(key), n: want.get(key) };
  });
}

// ── Prompt ────────────────────────────────────────────────────────────────────

function buildPrompt(category, subcategory, level, n, avoid) {
  const avoidBlock = avoid.length
    ? `\nNIE powtarzaj poniższych istniejących pytań (ani ich parafraz):\n${avoid.map(q => `- ${q}`).join('\n')}\n`
    : '';
  return `Jesteś generatorem pytań quizowych w języku polskim.

Wygeneruj ${n} RÓŻNYCH pytań quizowych dla kategorii "${category}", subkategorii "${subcategory}".
Poziom trudności: ${level}
${avoidBlock}
Zasady:
- Pytania i odpowiedzi w języku polskim
- Każde pytanie maksymalnie 200 znaków
- Poprawna odpowiedź maksymalnie 50 znaków
- Dokładnie 1 poprawna odpowiedź i dokładnie 3 błędne
- ŻADNE pole nie może zawierać znaku średnika ";" ani znaku nowej linii
- Pytania merytorycznie poprawne, weryfikowalne, ściśle związane z subkategorią
- Błędne odpowiedzi wiarygodne (nie absurdalne), różne od poprawnej

Odpowiedz WYŁĄCZNIE tablicą JSON (bez markdown, bez komentarzy):
[
  { "question": "...", "correct": "...", "wrong": ["...", "...", "..."] }
]`;
}

// ── OpenAI ────────────────────────────────────────────────────────────────────

async function callOpenAI(prompt, apiKey, model) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 2000,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/** Wyłuskaj pierwszą zbalansowaną tablicę JSON z tekstu. */
function extractJsonArray(text) {
  const start = text.indexOf('[');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }
  return null;
}

// ── Walidacja pojedynczego pytania ────────────────────────────────────────────

function clean(s) { return String(s ?? '').trim(); }
function csvSafe(s) { return !/[;\n\r]/.test(s); }

function validate(item) {
  const question = clean(item.question);
  const correct  = clean(item.correct);
  const wrong    = Array.isArray(item.wrong) ? item.wrong.map(clean) : [];

  if (!question)             return { ok: false };
  if (question.length > 200) return { ok: false };
  if (!correct)              return { ok: false };
  if (correct.length > 50)   return { ok: false };
  if (wrong.length !== 3)    return { ok: false };
  if (wrong.some(w => !w))   return { ok: false };
  if (!csvSafe(question))    return { ok: false };
  if (![correct, ...wrong].every(csvSafe)) return { ok: false };

  // brak powtórzeń wśród odpowiedzi (z poprawną włącznie)
  const lower = [correct, ...wrong].map(a => a.toLowerCase());
  if (new Set(lower).size !== lower.length) return { ok: false };

  return { ok: true, question, correct, wrong };
}

// ── Generowanie dla pojedynczego celu ─────────────────────────────────────────

async function generateForTarget(target, apiKey, model, dedup) {
  const { category, subcategory, level, n, batch } = target;
  const avoid = dedup.bySubcategory.get(subKey(category, subcategory)) || [];
  const accepted = [];
  let remaining = n;
  let attempts = 0;

  while (remaining > 0 && attempts < MAX_ATTEMPTS) {
    attempts++;
    const ask = Math.min(remaining, batch);
    let raw;
    try {
      raw = await callOpenAI(buildPrompt(category, subcategory, level, ask, avoid.slice(0, 40)), apiKey, model);
    } catch (e) {
      if (attempts >= MAX_ATTEMPTS) throw new Error(e.message);
      continue;
    }

    let parsed;
    try {
      const arr = extractJsonArray(raw);
      parsed = arr ? JSON.parse(arr) : null;
    } catch { parsed = null; }
    if (!Array.isArray(parsed)) continue;

    for (const item of parsed) {
      if (remaining <= 0) break;
      const v = validate(item);
      if (!v.ok) continue;
      const key = normalize(v.question);
      if (dedup.seen.has(key)) continue;          // duplikat globalny lub z tego przebiegu
      dedup.seen.add(key);
      avoid.push(v.question);
      accepted.push({ category, subcategory, level, ...v });
      remaining--;
    }
  }
  return accepted;
}

// ── Zapis do CSV ──────────────────────────────────────────────────────────────

function toCsvLine(q) {
  return [q.category, q.subcategory, q.level, q.question, q.correct, ...q.wrong].join(';');
}

function appendToCsv(rawText, newQuestions) {
  const body = rawText.endsWith('\n') ? rawText : rawText + '\n';
  const lines = newQuestions.map(toCsvLine).join('\n') + '\n';
  writeFileSync(CSV_PATH, body + lines, 'utf-8');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();
  const apiKey = process.env.OPENAI_API_KEY;
  const model  = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey && !opts.dryRun) {
    console.error('Błąd: brak OPENAI_API_KEY. Ustaw klucz lub użyj --dry-run.');
    process.exit(1);
  }

  const { rawText, rows } = loadCsv();

  // Deduplikacja: globalny zbiór znormalizowanych pytań + indeks per subkategoria.
  const dedup = { seen: new Set(), bySubcategory: new Map() };
  for (const r of rows) {
    dedup.seen.add(normalize(r.question));
    const key = subKey(r.category, r.subcategory);
    if (!dedup.bySubcategory.has(key)) dedup.bySubcategory.set(key, []);
    dedup.bySubcategory.get(key).push(r.question);
  }

  const plan = buildPlan(rows, opts.count, opts.category, opts.level)
    .map(t => ({ ...t, batch: opts.batch }));

  console.log(`📄 CSV:        ${CSV_PATH}`);
  console.log(`📊 W bazie:    ${rows.length} pytań`);
  console.log(`🎯 Cel:        +${opts.count} pytań${opts.category ? ` (kategoria: ${opts.category})` : ''}`);
  console.log(`🧩 Plan:       ${plan.length} subkategorii do rozbudowy`);
  if (opts.level) console.log(`📈 Poziom:     ${opts.level} (wymuszony)`);
  if (opts.dryRun) console.log('🔍 Tryb:       dry-run (CSV NIE zostanie zmieniony)');
  console.log('');

  if (opts.dryRun && !apiKey) {
    console.log('ℹ️  Brak OPENAI_API_KEY — pokazuję sam plan:\n');
    plan.forEach(t => console.log(`  +${t.n}  ${t.category} › ${t.subcategory} [${t.level}]`));
    console.log(`\nRazem zaplanowano: ${plan.reduce((s, t) => s + t.n, 0)} pytań`);
    return;
  }

  const all = [];
  for (const target of plan) {
    process.stdout.write(`Generuję +${target.n}: ${target.category} › ${target.subcategory} [${target.level}] … `);
    try {
      const got = await generateForTarget(target, apiKey, model, dedup);
      all.push(...got);
      console.log(got.length === target.n ? `✓ ${got.length}` : `⚠ ${got.length}/${target.n}`);
    } catch (e) {
      console.log('✗');
      console.error(`   Błąd: ${e.message}`);
    }
  }

  if (opts.dryRun) {
    console.log(`\n🔍 Dry-run: gotowych ${all.length} pytań (CSV niezmieniony).`);
    all.slice(0, 10).forEach(q => console.log(`   • [${q.category}/${q.subcategory}] ${q.question} → ${q.correct}`));
    if (all.length > 10) console.log(`   … i ${all.length - 10} więcej`);
    return;
  }

  if (all.length > 0) {
    appendToCsv(rawText, all);
    console.log(`\n✅ Dopisano ${all.length} pytań do ${CSV_PATH}`);
  } else {
    console.log('\n⚠️  Nie dodano żadnych pytań.');
  }

  // Kody wyjścia: 0 = pełny sukces, 2 = częściowy, 1 = nic
  if (all.length === 0) process.exit(1);
  if (all.length < opts.count) process.exit(2);
}

main().catch(e => {
  console.error(`\n💥 Nieoczekiwany błąd: ${e.message}`);
  process.exit(1);
});
