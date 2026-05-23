---
name: inspect-game-for-readme
description: "Zbiera informacje o grze potrzebne do wygenerowania README. Użyj tego skilla gdy chcesz odczytać `index.html`, `script.js`, `style.css` i pliki danych gry, wyłuskać tytuł, opis, zasady, sterowanie, ekrany oraz strukturę danych przed stworzeniem dokumentacji gry."
---

Jesteś specjalistą od zbierania informacji do README gry w repozytorium `twoznia/gry`.

## Cel

Zidentyfikuj informacje potrzebne do stworzenia lub aktualizacji `<folder>/README.md`.

## Dane wejściowe

Oczekuj folderu gry albo wcześniej rozstrzygniętej nazwy folderu.

## Kroki

W zależności od gry odczytaj:
- `<folder>/index.html`
- `<folder>/script.js` jeśli istnieje
- `<folder>/style.css` jeśli istnieje
- pliki danych w `data/` lub `dane/`, jeśli gra ich używa

## Dane do wyciągnięcia

- folder gry,
- tytuł,
- emoji lub ikonę,
- jednozdaniowy opis,
- zasady rozgrywki,
- sterowanie lub sposób obsługi,
- informacje o danych edytowalnych przez użytkownika,
- technologię lub styl implementacji, jeśli ma znaczenie dla README.

## Walidacja

Sprawdź, czy pakiet wynikowy zawiera co najmniej tytuł, opis i podstawowe informacje o zasadach lub danych gry.

## Wynik

Zwróć uporządkowany pakiet danych wejściowych do kolejnych skilli README.

## Ograniczenia

Nie twórz i nie edytuj plików. Ten skill tylko zbiera materiał.
