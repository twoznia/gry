---
name: add-reflex-game
description: "Kompletuje nową grę w katalogu reflex/: sprawdza/dodaje back-link, zapis rekordu w localStorage i kartę w reflex/index.html. Użyj gdy nowy folder w reflex/ jest gotowy i trzeba go zintegrować z resztą."
---

Jesteś specjalistą od integracji nowych gier w katalogu `reflex/` projektu `twoznia/gry`.

## Cel

Upewnij się, że gra w `reflex/<folder>/index.html` ma:
1. **Back-link** — przycisk ← Wróć prowadzący do `../` (menu reflex)
2. **Zapis rekordu** — localStorage z funkcjami load/save
3. **Kartę w menu** — wpis w `reflex/index.html`

---

## Krok 1 — Back-link

Sprawdź czy `reflex/<folder>/index.html` zawiera:
```html
<a class="back-link" href="../">← Wróć</a>
```
bezpośrednio po `<body>`.

Jeśli CSS `.back-link` nie istnieje w pliku, dodaj do `<style>`:
```css
.back-link { position: fixed; top: 10px; left: 10px; z-index: 100; background: #334155; color: #fff; border: 1px solid #475569; border-radius: 8px; padding: 8px 14px; text-decoration: none; font-size: 13px; }
.back-link:hover { background: #475569; }
```

---

## Krok 2 — Zapis rekordu w localStorage

Sprawdź czy gra już zapisuje rekord (`localStorage.setItem` / `BEST_KEY` / `RECORDS_KEY`).

Jeśli **nie ma** — dodaj minimalny wzorzec na początku bloku `<script>`:

```js
// ─── Rekord ────────────────────────────────────────────────────────────────────
const BEST_KEY = 'reflex<NazwaGry>Best';   // np. reflexSnajperBest
function loadBest() { try { return parseInt(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } }
function saveBest(val) { if (val > loadBest()) localStorage.setItem(BEST_KEY, val); }
```

Gdzie wbudować wyświetlanie rekordu:
- **Po zakończeniu gry** (`endGame`, `gameOver` lub podobna funkcja) — wywołaj `saveBest(score)` i pokaż rekord obok wyniku, np.:
```js
saveBest(score);
// w HTML endgame:
// `Rekord: <span>${loadBest()}</span> pkt`
```

Jeśli gra ma **tryby** (child/adult, łatwy/trudny) — użyj wzorca z obiektem jak w samuraj:
```js
const BEST_KEY = 'reflex<NazwaGry>Best';
function loadBest() { try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; } catch { return {}; } }
function bestFor(mode) { return loadBest()[mode] || 0; }
function saveBest(mode, val) {
    const b = loadBest(); if (val > (b[mode] || 0)) { b[mode] = val; localStorage.setItem(BEST_KEY, JSON.stringify(b)); }
}
```

---

## Krok 3 — Karta w reflex/index.html

Sprawdź czy `reflex/index.html` zawiera `href="./<folder>/"`.

Jeśli **nie ma** — dodaj kartę na końcu `<div class="flex flex-wrap gap-6 justify-center">`, przed `</div>`:

```html
<a href="./<folder>/" class="variant-card card-<folder>">
    <div class="variant-icon"><emoji></div>
    <h2 class="text-2xl font-bold text-white mb-1"><Nazwa></h2>
    <p class="text-slate-400 text-sm text-center"><Krótki opis></p>
    <div class="mt-4 bg-<kolor>-600 hover:bg-<kolor>-500 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors">Zagraj</div>
</a>
```

Dodaj też CSS karty do `<style>` (wzoruj się na istniejących kartach):
```css
.card-<folder> { background: linear-gradient(135deg, #<kolor-dark> 0%, #1e293b 100%); border-color: #<kolor-accent>; }
.card-<folder> .variant-icon { font-size: 2.5rem; text-shadow: 0 0 20px rgba(<rgb>,0.5); }
.card-<folder>:hover { border-color: #<kolor-lighter>; }
```

---

## Wynik dla użytkownika

Zgłoś krótko:
- czy back-link był już obecny / dodany
- czy rekord był już obecny / dodany (i jaki klucz localStorage)
- czy karta w reflex/index.html była już obecna / dodana
