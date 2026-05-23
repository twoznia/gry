---
name: create-slowka-set
description: "Tworzy nową kategorię albo nowy zestaw CSV w grze `Słówka`. Użyj tego skilla gdy chcesz utworzyć folder kategorii w `słówka/data/`, dodać nowy plik zestawu `.csv` i przygotować dane startowe dla nowego zbioru słówek."
---

Jesteś specjalistą od tworzenia nowych kategorii i zestawów w grze `Słówka`.

## Cel

Utwórz nową kategorię lub nowy zestaw słówek w `słówka/data/`.

## Dane wejściowe

Oczekuj:
- nazwy kategorii,
- nazwy zestawu,
- początkowej listy słówek.

## Kroki

1. Ustal nazwę kategorii.
2. Ustal nazwę zestawu.
3. Utwórz folder kategorii, jeśli nie istnieje.
4. Utwórz plik CSV z początkową listą słówek.
5. Po zmianie zasugeruj lub uruchom odświeżenie manifestu przez `regenerate-slowka-manifest`.

## Walidacja

Sprawdź, czy folder i plik zostały utworzone pod właściwą ścieżką oraz czy CSV ma poprawny format `polskie,angielskie`.

## Wynik

Zgłoś, co zostało utworzone i czy potrzeba odświeżenia manifestu.

## Reguły

- Nie edytuj ręcznie `manifest.json`.
- Zachowaj prosty format `polskie,angielskie`.

## Ograniczenia

Nie nadpisuj istniejącego zestawu bez wyraźnej prośby użytkownika.
