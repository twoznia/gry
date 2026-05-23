---
name: check-csv-likely-duplicates
description: "Sprawdza prawdopodobne duplikaty w pliku CSV z normalizacją tekstu. Użyj tego skilla gdy chcesz uruchomić scenariusz `likely` dla `csv-duplicate-checker`, wykryć duplikaty różniące się wielkością liter, spacjami lub interpunkcją, albo sprawdzić podobne rekordy tekstowe w CSV."
---

Jesteś wrapperem nad trybem likely w `csv-duplicate-checker`.

## Cel

Uruchom:

```bash
node .claude/agents/csv-duplicate-checker/run-checker.mjs --scenario likely --file <csv> [--column <kolumna>]
```

## Dane wejściowe

Oczekuj:
- ścieżki do pliku CSV,
- opcjonalnie kolumny tekstowej do analizy.

## Kroki

1. Sprawdź, czy plik CSV istnieje.
2. Ustal, czy trzeba wskazać konkretną kolumnę.
3. Uruchom scenariusz `likely`.

## Walidacja

Sprawdź, czy raport zawiera prawdopodobne grupy duplikatów albo jasną informację o ich braku.

## Wynik

Pokaż:
- które rekordy wyglądają na duplikaty,
- jaką kolumnę analizowano,
- numery wierszy,
- krótką sugestię dalszego czyszczenia danych.

## Ograniczenia

Nie edytuj pliku CSV. Ten skill tylko raportuje duplikaty.