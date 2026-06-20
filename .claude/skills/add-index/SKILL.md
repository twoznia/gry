---
name: add-index
description: "Rejestruje nową grę w projekcie twoznia/gry — dodaje kartę do głównego index.html, wpis do README.md, aktualizuje status.md i wstawia przycisk ← Wróć w grze. Użyj tego skilla zawsze gdy nowy folder gry jest już na dysku i trzeba go dopisać do menu, albo gdy użytkownik mówi 'dodaj grę do indexu', 'zarejestruj grę', 'dodaj do menu' lub prosi o synchronizację po dodaniu gry."
---

Jesteś orkiestratorem rejestrowania nowej gry w projekcie `twoznia/gry`.

Folder gry już istnieje — Twoim zadaniem jest dopilnowanie, żeby gra pojawiła się w głównym menu (`index.html`), dokumentacji (`README.md`) i pliku statusu (`status.md`), oraz żeby miała standardowy przycisk powrotu.

## Dane wejściowe

Użytkownik może podać:
- nazwę folderu gry (np. `koloruj`, `moja-gra`)
- albo nic — wtedy sam wykryj grę, której jeszcze nie ma w `index.html`

## Krok 1 — Ustal, której gry dotyczy zadanie

Jeśli użytkownik podał nazwę folderu, użyj jej.

Jeśli nie podał, wywołaj skill **`detect-root-games`**, żeby uzyskać pełną listę folderów z `index.html`, a następnie porównaj ją z kartami w głównym `index.html` — szukasz folderu, który **istnieje na dysku, ale nie ma jeszcze karty w `<main class="game-container">`**.

Jeśli jest więcej niż jedna taka gra, zapytaj użytkownika, którą chce zarejestrować.

## Krok 2 — Wyciągnij metadane gry

Wywołaj skill **`extract-game-metadata`** dla tego folderu.

Skill odczyta tytuł, emoji/ikonę i krótki opis z pliku `<folder>/index.html`.

Jeśli opis jest niedostępny lub zbyt techniczny, przeczytaj `<folder>/index.html` samodzielnie i zaproponuj krótki opis po polsku (1–2 zdania), który dobrze brzmi jako podpis karty w menu. Opis powinien opisywać, co robi gracz — nie co robi kod.

Ikona to emoji; jeśli gra jej nie ma, dobierz trafne na podstawie tematyki gry.

## Krok 3 — Wstaw kartę do głównego index.html

Wywołaj skill **`sync-root-index-cards`** z metadanymi tej gry.

Karta zostanie dodana na końcu `<main class="game-container">` w formacie:

```html
<a href="./<folder>/" class="game-card">
    <span class="icon">🎮</span>
    <h2>Nazwa Gry</h2>
    <p style="color: #94a3b8; font-size: 0.9rem;">Krótki opis.</p>
    <div class="play-btn">Zagraj</div>
</a>
```

## Krok 4 — Dodaj wpis do README.md

Wywołaj skill **`sync-root-readme-contents`** z tymi samymi metadanymi.

Wpis trafi do sekcji `## Zawartość` w formacie:

```markdown
- **[Nazwa Gry](./<folder>/)** 🎮 – Krótki opis.
```

## Krok 5 — Dodaj przycisk ← Wróć

Wywołaj skill **`add-game-back-link`** dla tego folderu.

Skill sprawdzi, czy `<a class="back-link" href="../">← Wróć</a>` już istnieje i doda go jeśli brakuje, albo ujednolici istniejący wariant.

## Krok 6 — Zaktualizuj status.md

Wywołaj skill **`sync-games-status-file`** z wynikiem z kroku 5 (czy back-link był już obecny, został dodany, czy ujednolicony).

## Wynik dla użytkownika

Na końcu zgłoś krótkie podsumowanie:
- nazwa zarejestrowanej gry i jej folder
- czy karta była nowa czy zaktualizowana
- czy wpis w README był nowy czy zaktualizowany
- status back-link (obecny / dodany / ujednolicony)

Nie opisuj szczegółów technicznych kodu — wystarczy jednoliniowe potwierdzenie każdego kroku.
