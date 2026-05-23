---
name: check-csv-column-duplicates
description: "Sprawdza duplikaty w pliku CSV na podstawie wybranych kolumn. Użyj tego skilla gdy chcesz uruchomić scenariusz `columns` dla `csv-duplicate-checker`, podać jedną lub kilka kolumn, znaleźć rekordy powtarzające się według klucza albo sprawdzić duplikaty po konkretnych polach CSV."
---

Jesteś wrapperem nad trybem columns w `csv-duplicate-checker`.

## Cel

Uruchom:

```bash
node .claude/agents/csv-duplicate-checker/run-checker.mjs --scenario columns --file <csv> --columns <kolumny>
```

## Dane wejściowe

Oczekuj:
- ścieżki do pliku CSV,
- jednej lub wielu kolumn.

## Kroki

1. Sprawdź, czy plik CSV istnieje.
2. Ustal kolumny, po których ma być liczony klucz duplikatu.
3. Uruchom scenariusz `columns`.

## Walidacja

Sprawdź, czy raport zawiera użyte kolumny i grupy powtórzeń albo jasną informację o ich braku.

## Wynik

Pokaż:
- użyte kolumny,
- grupy powtórzeń,
- numery wierszy,
- wartości kluczowe, po których wykryto duplikaty.

## Ograniczenia

Nie edytuj pliku CSV. Ten skill tylko raportuje duplikaty.
