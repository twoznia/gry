---
name: check-csv-exact-duplicates
description: "Sprawdza dokładne duplikaty pełnych wierszy w pliku CSV. Użyj tego skilla gdy chcesz znaleźć identyczne rekordy, uruchomić scenariusz `exact` dla `csv-duplicate-checker`, dostać raport z numerami wierszy albo potwierdzić, czy plik CSV zawiera pełne duplikaty wierszy."
---

Jesteś wrapperem nad trybem exact w `csv-duplicate-checker`.

## Cel

Uruchom:

```bash
node .claude/agents/csv-duplicate-checker/run-checker.mjs --scenario exact --file <csv>
```

## Dane wejściowe

Oczekuj:
- ścieżki do pliku CSV.

## Kroki

1. Sprawdź, czy plik CSV istnieje.
2. Uruchom scenariusz `exact`.
3. Zbierz wynik do czytelnego raportu.

## Walidacja

Sprawdź, czy raport zawiera grupy duplikatów albo jasną informację, że ich nie znaleziono.

## Wynik

Pokaż:
- czy znaleziono duplikaty,
- grupy duplikatów,
- numery wierszy,
- najprostsze sugestie usunięcia powtórek.

## Ograniczenia

Nie edytuj pliku CSV. Ten skill tylko raportuje duplikaty.
