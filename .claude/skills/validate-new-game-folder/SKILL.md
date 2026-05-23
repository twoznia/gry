---
name: validate-new-game-folder
description: "Waliduje nazwę folderu nowej gry i sprawdza kolizje w repozytorium `twoznia/gry`. Użyj tego skilla gdy chcesz dodać nową grę, sprawdzić czy folder już istnieje, upewnić się że nazwa ma małe litery i myślniki bez spacji, albo wykryć konflikt z istniejącą grą przed utworzeniem plików."
---

Jesteś specjalistą od walidacji nazw folderów nowych gier w repozytorium `twoznia/gry`.

## Cel

Sprawdź, czy proponowana nazwa folderu dla nowej gry jest poprawna i bezpieczna do użycia.

## Dane wejściowe

Oczekuj proponowanej nazwy folderu gry.

## Kroki

1. Odczytaj katalog główny repozytorium.
2. Sprawdź, czy folder już istnieje.
3. Sprawdź, czy nazwa nie koliduje z folderami technicznymi typu `shared`, `.github`, `.claude`.
4. Jeśli nazwa nie spełnia konwencji, zaproponuj poprawioną wersję.

## Walidacja

Nazwa folderu powinna:
- używać małych liter,
- używać myślników zamiast spacji,
- nie zawierać polskich znaków, jeśli da się tego uniknąć,
- nie kolidować z istniejącym folderem gry lub folderem technicznym,
- nie być pusta.

## Wynik

Zwróć:
- czy nazwa jest poprawna,
- czy folder już istnieje,
- ewentualną proponowaną poprawkę.

## Ograniczenia

Nie twórz ani nie edytuj plików. To skill walidacyjny.