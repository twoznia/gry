---
name: scaffold-new-game-files
description: "Tworzy starter plików nowej gry przeglądarkowej w repozytorium `twoznia/gry`. Użyj tego skilla gdy masz już specyfikację gry i chcesz utworzyć folder gry, plik `index.html`, `style.css` i `script.js`, dobrać prosty szablon pod typ gry albo zapisać zewnętrznie wygenerowany HTML/CSS/JS jako bazę nowej gry, z zachowaniem standardowego back-linku."
---

Jesteś specjalistą od tworzenia starterów nowych gier w repozytorium `twoznia/gry`.

## Cel

Na podstawie gotowej specyfikacji gry utwórz minimalny, działający szkielet plików nowej gry albo zapisz zewnętrznie dostarczony kod jako bazę gry.

## Dane wejściowe

Oczekuj pól:
- `folder`
- `title`
- `icon`
- `description`
- `type`
- trybu pracy: `starter` albo `external-html`
- opcjonalnie gotowego `index.html`
- opcjonalnie gotowego `style.css`
- opcjonalnie gotowego `script.js`

## Kroki

1. Utwórz folder gry.
2. Jeśli tryb to `starter`, wygeneruj minimalne pliki startowe.
3. Jeśli tryb to `external-html`, zapisz dostarczony `index.html` i opcjonalne pliki towarzyszące.
4. Nie nadpisuj dostarczonego kodu bardziej, niż wymaga to integracja z repo.
5. Dopilnuj, by końcowy układ plików był spójny i gotowy do dalszego workflow.

## Pliki do utworzenia

W folderze `<folder>/` utwórz:
- `index.html`
- `style.css`
- `script.js`

## Reguły szablonu

### `index.html`

- w trybie `starter` zawsze dołącz:
  - `../shared/style.css`
  - lokalny `style.css`
- w trybie `starter` zawsze dodaj w `<body>`:
  ```html
  <a class="back-link" href="../">← Wróć</a>
  ```
- dla większości gier w trybie `starter` użyj ekranów:
  - start
  - game
  - end
- dla typu `quiz` przygotuj sekcję pytania i odpowiedzi,
- dla gry canvas dodaj `canvas`, jeśli wynika to jasno z wymagań użytkownika,
- w trybie `external-html` zachowaj dostarczoną strukturę i potraktuj ją jako źródło prawdy; integrację projektu ogranicz do minimalnych zmian wymaganych przez osobne skille.

### `style.css`

- w trybie `starter` utwórz minimalny plik zgodny z projektem,
- w trybie `external-html` zapisz plik tylko jeśli użytkownik go dostarczył albo jeśli trzeba wydzielić lokalne style na jego prośbę,
- bez frameworków i bez bundlera.

### `script.js`

- w trybie `starter` używaj `const` i `let`,
- w trybie `starter` dodaj prostą logikę przełączania ekranów,
- w trybie `external-html` zapisz plik tylko jeśli użytkownik go dostarczył albo jeśli trzeba wyciągnąć logikę z HTML na jego prośbę,
- nie dodawaj złożonej mechaniki, jeśli użytkownik o nią nie poprosił.

## Ograniczenia

- Nie aktualizuj jeszcze głównego `index.html` ani `README.md`, jeśli agent-orkiestrator ma do tego osobne skille.
- Nie twórz `node_modules`, nie używaj npm, nie dodawaj frameworków.
- Nie przebudowuj dostarczonego zewnętrznego HTML do wzorca startera, jeśli nie ma takiej potrzeby.

## Walidacja

Po utworzeniu sprawdź:
- czy folder gry istnieje,
- czy wymagane pliki dla wybranego trybu istnieją,
- czy w trybie `starter` `index.html` zawiera `../shared/style.css`, lokalny `style.css` i standardowy back-link,
- czy w trybie `external-html` zapisano dostarczony kod bez nieuzasadnionego przepisywania.

## Wynik

Krótko zgłoś:
- ścieżki utworzonych plików,
- jaki tryb został użyty: `starter` albo `external-html`.