---
name: add-reflex-game
description: "Standaryzuje grę w katalogu reflex/ do konwencji projektu: tryby Dziecko/Dorosły, zapis rekordów (leaderboard w localStorage) i spójny back-link ← Wróć, plus karta w reflex/index.html. Użyj przy tworzeniu nowej gry reflex lub ujednolicaniu istniejącej."
---

Jesteś specjalistą od gier w katalogu `reflex/` projektu `twoznia/gry`. Zadbaj, by każda gra spełniała **trzy kanony** poniżej. Wzorce referencyjne: `reflex/kolory/` i `reflex/stroop/`.

## 1. Tryby trudności: Dziecko i Dorosły

Każda gra ma dwa tryby różniące się trudnością:
- **Dziecko (`child`)** — łatwiejszy, **3 poziomy**
- **Dorosły (`adult`)** — trudniejszy, **4 poziomy**

Poziomy różnią się parametrem trudności (np. czas na reakcję, liczba elementów). Wzorzec:

```js
const LEVELS = [
    { mode: 'child', num: 1, base: /* najłatwiej */ },
    { mode: 'child', num: 2, base: /* ... */ },
    { mode: 'child', num: 3, base: /* ... */ },
    { mode: 'adult', num: 1, base: /* ... */ },
    { mode: 'adult', num: 2, base: /* ... */ },
    { mode: 'adult', num: 3, base: /* ... */ },
    { mode: 'adult', num: 4, base: /* najtrudniej */ },
];
```

Ekran startowy pozwala wybrać tryb i poziom; po grze wraca do menu z wynikiem.

## 2. Rekordy (leaderboard w localStorage)

Zapis **tak samo jak w pozostałych grach reflex** — obiekt JSON z imieniem gracza, sortowany, top 5, kluczowany trybem i poziomem.

```js
const RECORDS_KEY = 'reflex<NazwaGry>Records';   // np. reflexStroopRecords
const NAME_KEY    = 'reflex<NazwaGry>LastName';  // zapamiętane imię gracza
const MAX_RECORDS = 5;

function loadRecords() { try { return JSON.parse(localStorage.getItem(RECORDS_KEY)) || {}; } catch (e) { return {}; } }
function saveRecords(r) { localStorage.setItem(RECORDS_KEY, JSON.stringify(r)); }
let records = loadRecords();

function levelList(mode, num) { return (records[mode] && records[mode][num]) || []; }
function bestScore(mode, num) { const l = levelList(mode, num); return l.length ? l[0].score : 0; }
function addRecord(mode, num, name, score) {
    if (!records[mode]) records[mode] = {};
    if (!records[mode][num]) records[mode][num] = [];
    records[mode][num].push({ name: name.trim() || '???', score, date: new Date().toLocaleDateString('pl-PL') });
    records[mode][num].sort((a, b) => b.score - a.score);     // wynik: większy = lepszy
    records[mode][num] = records[mode][num].slice(0, MAX_RECORDS);
    saveRecords(records);
}
```

Wymagane elementy UI:
- po grze **pole na imię** (`value` = `localStorage.getItem(NAME_KEY)`) + przycisk **„Zapisz wynik"**; przy zapisie ustaw `NAME_KEY` i wywołaj `addRecord`,
- **tablica rekordów** z zakładkami trybu (Dziecko/Dorosły) i poziomu (1–3 / 1–4), top 5 `{imię, wynik, data}`,
- „nowy rekord", gdy `score > bestScore(mode, num)`.

> Jeśli metryką jest czas ukończenia (mniejszy = lepszy), sortuj rosnąco i przechowuj `time` zamiast `score` (jak `reflex/kolory/`).

## 3. Spójny back-link ← Wróć (we WSZYSTKICH grach)

Bezpośrednio po `<body>`:
```html
<a class="back-link" href="../">← Wróć</a>
```
Z jednolitym CSS (w `style.css` gry):
```css
.back-link { position: fixed; top: 10px; left: 10px; z-index: 100; background: #334155; color: #fff; border: 1px solid #475569; border-radius: 8px; padding: 8px 14px; text-decoration: none; font-size: 13px; }
.back-link:hover { background: #475569; }
```
Przy ujednolicaniu sprawdź **każdą** podgrę w `reflex/` — ten sam tekst (`← Wróć`), cel (`../`), pozycja (lewy górny róg) i styl.

## 4. Karta w reflex/index.html

Dodaj kartę gry w siatce `<div class="flex flex-wrap gap-6 justify-center">`:
```html
<a href="./<folder>/" class="variant-card card-<folder>">
    <div class="variant-icon"><emoji></div>
    <h2 class="text-2xl font-bold text-white mb-1"><Nazwa></h2>
    <p class="text-slate-400 text-sm text-center"><Krótki opis></p>
    <div class="mt-4 bg-<kolor>-600 hover:bg-<kolor>-500 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors">Zagraj</div>
</a>
```
oraz styl karty w `reflex/style.css`:
```css
.card-<folder> { background: linear-gradient(135deg, #<dark> 0%, #1e293b 100%); border-color: #<accent>; }
.card-<folder> .variant-icon { font-size: 2.5rem; text-shadow: 0 0 20px rgba(<rgb>,0.5); }
.card-<folder>:hover { border-color: #<lighter>; }
```

## Zasady projektu

- Nowe gry: osobny `index.html` / `style.css` / `script.js` (bez inline `<style>`/`<script>`).
- Walidacja: `node --check script.js`. Nie uruchamiaj przeglądarki bez słowa `test` w prompcie.

## Wynik dla użytkownika

Zgłoś krótko: tryby (child/adult) obecne/dodane, klucze rekordów, spójność back-linku, karta w `reflex/index.html`.
