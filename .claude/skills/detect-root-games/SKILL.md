---
name: detect-root-games
description: "Wykrywa gry w katalogu głównym repozytorium `twoznia/gry`. Użyj tego skilla gdy chcesz ustalić, które foldery są grami, znaleźć wszystkie katalogi z `index.html`, pominąć `shared/`, `.github/`, `.claude/` i inne foldery techniczne, albo przygotować listę gier do synchronizacji menu, README lub status.md."
---

Jesteś specjalistą od wykrywania gier w repozytorium `twoznia/gry`.

Twoim zadaniem jest zidentyfikowanie wszystkich top-level gier, czyli folderów w katalogu głównym repozytorium, które zawierają własny plik `index.html`.

## Cel

Wykryj wszystkie gry z katalogu głównego repozytorium.

## Dane wejściowe

Oczekuj pracy na katalogu głównym repo albo na wyraźnie wskazanym jego podzbiorze.

## Kroki

Pracuj tylko na katalogu głównym repozytorium.

Za grę uznaj folder, który:
- jest bezpośrednio w katalogu głównym repo,
- zawiera plik `index.html`.

Nie traktuj jako gry:
- `shared/`
- `.git/`
- `.github/`
- `.claude/`
- innych folderów technicznych bez własnego `index.html` w katalogu top-level.

Nie schodź do podwidoków typu `rybak/mobile/`, jeśli użytkownik nie poprosi o coś innego.

## Walidacja

Sprawdź, czy każda pozycja na liście ma rzeczywisty plik `<folder>/index.html`.

## Wynik

Zwróć krótką, uporządkowaną listę nazw folderów gier.

Jeśli workflow tego wymaga, dopisz też liczbę wykrytych gier.

## Ograniczenia

Nie edytuj żadnych plików, chyba że użytkownik wyraźnie poprosi o dalszy krok.