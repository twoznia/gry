#!/usr/bin/env node
/**
 * add_questions.mjs — CLI tool to add AI-generated questions to pytania/data/*.json files.
 *
 * Usage:
 *   node pytania/tools/add_questions.mjs --file muzyka.json [--level trudne] [--topic "..."] [--dry-run]
 *
 * Environment variables:
 *   OPENAI_API_KEY   required (unless --dry-run without key)
 *   OPENAI_MODEL     optional, default: gpt-4o-mini
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR   = resolve(__dirname, '../data');

const VALID_LEVELS  = ['łatwe', 'średnie', 'trudne', 'bardzo trudne'];
const DEFAULT_LEVEL = 'trudne';

// ── Help ─────────────────────────────────────────────────────────────────────

function showHelp() {
  console.log(`Użycie: node pytania/tools/add_questions.mjs --file <name> [opcje]

Opcje:
  --file <name>     Nazwa pliku w pytania/data (np. muzyka.json), nie może być manifest.json
  --level <value>   Poziom trudności: łatwe|średnie|trudne|bardzo trudne (domyślnie: trudne)
  --topic <text>    Opcjonalny kontekst/temat dla generowanych pytań
  --dry-run         Wyświetl zmiany bez zapisywania do pliku
  --help            Wyświetl tę pomoc

Zmienne środowiskowe:
  OPENAI_API_KEY    Klucz API OpenAI (wymagany, chyba że --dry-run bez klucza)
  OPENAI_MODEL      Model do użycia (domyślnie: gpt-4o-mini)

Przykłady:
  node pytania/tools/add_questions.mjs --file muzyka.json --level trudne --topic "muzyka klasyczna"
  node pytania/tools/add_questions.mjs --file historia.json --dry-run
  node pytania/tools/add_questions.mjs --file sport.json --level łatwe --topic "piłka nożna"
`);
}

// ── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { file: null, level: DEFAULT_LEVEL, topic: '', dryRun: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--file':    opts.file   = args[++i]; break;
      case '--level':   opts.level  = args[++i]; break;
      case '--topic':   opts.topic  = args[++i]; break;
      case '--dry-run': opts.dryRun = true;       break;
      case '--help':
      case '-h':        showHelp(); process.exit(0);
      default:
        console.error(`Nieznany argument: ${args[i]}`);
        showHelp();
        process.exit(1);
    }
  }
  return opts;
}

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(category, subcategory, level, topic) {
  const topicLine = topic ? `Dodatkowy kontekst/temat: ${topic}\n` : '';
  return `Jesteś generatorem pytań quizowych w języku polskim.

Wygeneruj 1 pytanie quizowe dla kategorii "${category}", subkategorii "${subcategory}".
${topicLine}Poziom trudności: ${level}

Zasady:
- Pytanie w języku polskim, maksymalnie 200 znaków
- Poprawna odpowiedź maksymalnie 50 znaków
- Dokładnie 4 odpowiedzi, dokładnie 1 poprawna (is_correct: true)
- Pytanie musi być merytorycznie poprawne i weryfikowalne
- Pytanie oryginalne, nawiązujące ściśle do podanej subkategorii

Odpowiedz WYŁĄCZNIE w formacie JSON (bez żadnego dodatkowego tekstu ani bloków markdown):
{
  "question": "...",
  "answers": [
    {"text": "...", "is_correct": true},
    {"text": "...", "is_correct": false},
    {"text": "...", "is_correct": false},
    {"text": "...", "is_correct": false}
  ]
}`;
}

// ── OpenAI API call ───────────────────────────────────────────────────────────

async function callOpenAI(prompt, apiKey, model) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens:  400,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI API ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateQuestion(q) {
  if (!q || typeof q !== 'object')
    throw new Error('Wynik nie jest obiektem JSON');
  if (typeof q.question !== 'string' || !q.question.trim())
    throw new Error('Brak lub puste pole "question"');
  if (q.question.length > 200)
    throw new Error(`Pytanie zbyt długie: ${q.question.length} > 200 znaków`);
  if (!Array.isArray(q.answers) || q.answers.length !== 4)
    throw new Error(`Wymagane dokładnie 4 odpowiedzi (znaleziono: ${Array.isArray(q.answers) ? q.answers.length : 'brak'})`);

  const correct = q.answers.filter(a => a.is_correct === true);
  if (correct.length !== 1)
    throw new Error(`Wymagana dokładnie 1 poprawna odpowiedź (znaleziono: ${correct.length})`);
  if (typeof correct[0].text !== 'string' || !correct[0].text.trim())
    throw new Error('Poprawna odpowiedź ma puste pole "text"');
  if (correct[0].text.length > 50)
    throw new Error(`Poprawna odpowiedź zbyt długa: ${correct[0].text.length} > 50 znaków`);

  for (const ans of q.answers) {
    if (typeof ans.text !== 'string' || !ans.text.trim())
      throw new Error('Co najmniej jedna odpowiedź ma puste pole "text"');
  }
}

// ── Generate single question (with retries) ───────────────────────────────────

async function generateQuestion(category, subcategory, level, topic, apiKey, model, existingQuestions) {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let raw;
    try {
      raw = await callOpenAI(buildPrompt(category, subcategory, level, topic), apiKey, model);
    } catch (e) {
      if (attempt === MAX_ATTEMPTS) throw new Error(`Błąd API: ${e.message}`);
      continue;
    }

    // Extract JSON block from response
    let parsed;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Brak bloku JSON w odpowiedzi');
      parsed = JSON.parse(match[0]);
    } catch (e) {
      if (attempt === MAX_ATTEMPTS) throw new Error(`Nieprawidłowy JSON: ${e.message}`);
      continue;
    }

    // Structural / length validation
    try {
      validateQuestion(parsed);
    } catch (e) {
      if (attempt === MAX_ATTEMPTS) throw new Error(`Walidacja nie powiodła się: ${e.message}`);
      continue;
    }

    // Duplicate check (case-insensitive, same subcategory)
    const duplicate = existingQuestions.some(
      q => q.subcategory === subcategory &&
           q.question.trim().toLowerCase() === parsed.question.trim().toLowerCase(),
    );
    if (duplicate) {
      if (attempt === MAX_ATTEMPTS) throw new Error('Wygenerowane pytanie jest duplikatem');
      continue;
    }

    return {
      subcategory,
      question: parsed.question.trim(),
      level,
      answers:  parsed.answers.map(a => ({ text: a.text.trim(), is_correct: a.is_correct })),
    };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const { file, level, topic, dryRun } = parseArgs();

  // ── Validate --file ──
  if (!file) {
    console.error('Błąd: wymagany parametr --file <name>\n');
    showHelp();
    process.exit(1);
  }

  if (basename(file) === 'manifest.json') {
    console.error('Błąd: manifest.json jest plikiem systemowym — nie można go edytować tym narzędziem.');
    process.exit(1);
  }

  // ── Validate --level ──
  if (!VALID_LEVELS.includes(level)) {
    console.error(`Błąd: nieprawidłowy poziom "${level}". Dozwolone: ${VALID_LEVELS.join(', ')}`);
    process.exit(1);
  }

  // ── Resolve path ──
  const filePath = file.includes('/') ? resolve(file) : join(DATA_DIR, file);
  if (!existsSync(filePath)) {
    console.error(`Błąd: plik nie istnieje: ${filePath}`);
    process.exit(1);
  }

  // ── Check API key ──
  const apiKey = process.env.OPENAI_API_KEY;
  const model  = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey && !dryRun) {
    console.error('Błąd: brak zmiennej środowiskowej OPENAI_API_KEY.');
    console.error('Ustaw:   export OPENAI_API_KEY=sk-...');
    console.error('Lub użyj --dry-run do podglądu bez generowania.');
    process.exit(1);
  }

  // ── Load and parse JSON ──
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Błąd: nie można wczytać pliku JSON: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(data.questions)) {
    console.error('Błąd: plik nie zawiera tablicy "questions".');
    process.exit(1);
  }

  // ── Discover unique subcategories (order-preserving) ──
  const subcategories = [...new Set(data.questions.map(q => q.subcategory))];

  // ── Summary header ──
  console.log(`📁 Plik:        ${file}`);
  console.log(`📚 Kategoria:   ${data.category}`);
  console.log(`🏷️  Subkategorie (${subcategories.length}):`);
  subcategories.forEach(s => console.log(`   • ${s}`));
  console.log(`📊 Poziom:      ${level}`);
  if (topic)   console.log(`💡 Temat:       ${topic}`);
  if (dryRun)  console.log('🔍 Tryb:        dry-run (plik NIE zostanie zmieniony)');
  console.log('');

  // ── Dry-run without key → only show plan ──
  if (dryRun && !apiKey) {
    console.log('ℹ️  Brak OPENAI_API_KEY — pokazuję plan bez generowania:\n');
    subcategories.forEach(s => console.log(`  → Dodałoby pytanie dla: "${s}"`));
    console.log(`\nRazem: ${subcategories.length} pytań`);
    return;
  }

  // ── Generate one question per subcategory ──
  const newQuestions = [];
  const errors       = [];

  for (const subcategory of subcategories) {
    process.stdout.write(`Generuję: "${subcategory}" … `);
    try {
      const q = await generateQuestion(
        data.category, subcategory, level, topic, apiKey, model, data.questions,
      );
      newQuestions.push(q);
      console.log('✓');
      if (dryRun) {
        const correctAns = q.answers.find(a => a.is_correct);
        console.log(`   Q: ${q.question}`);
        console.log(`   A: ${correctAns.text}\n`);
      }
    } catch (e) {
      console.log('✗');
      errors.push({ subcategory, error: e.message });
      console.error(`   Błąd: ${e.message}\n`);
    }
  }

  // ── Write results ──
  if (!dryRun && newQuestions.length > 0) {
    data.questions.push(...newQuestions);
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`\n✅ Dodano ${newQuestions.length} pytań do ${file}`);
  } else if (dryRun && newQuestions.length > 0) {
    console.log(`\n🔍 Dry-run: ${newQuestions.length} pytań gotowych do dodania (plik niezmieniony)`);
  }

  if (errors.length > 0) {
    console.error(`\n⚠️  Błędy (${errors.length} subkategorii):`);
    errors.forEach(({ subcategory, error }) =>
      console.error(`   • "${subcategory}": ${error}`),
    );
    // Exit code 1 if all failed, 2 if only some failed
    process.exit(errors.length === subcategories.length ? 1 : 2);
  }
}

main().catch(e => {
  console.error(`\n💥 Nieoczekiwany błąd: ${e.message}`);
  process.exit(1);
});
