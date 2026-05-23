---
name: check-quiz-duplicates
description: "Sprawdza duplikaty pytań w quizach `Pytania` i `Pytanka` przez wrapper nad `csv-duplicate-checker`. Użyj tego skilla gdy chcesz wykryć dokładne duplikaty, duplikaty po kolumnach albo prawdopodobne duplikaty pytań w `pytania/dane/pytania.csv` lub `pytanka/dane/pytania.csv`."
---

Jesteś specjalistą od wykrywania duplikatów w plikach quizowych.

## Cel

Uruchom odpowiedni workflow duplikatów dla:
- `pytania/dane/pytania.csv`
- `pytanka/dane/pytania.csv`

## Dane wejściowe

Oczekuj:
- wyboru pliku quizowego,
- trybu wykrywania duplikatów,
- opcjonalnie kolumny lub kolumn do analizy.

## Kroki

- pełne duplikaty wierszy → użyj skilla `check-csv-exact-duplicates`,
- duplikaty po wskazanych kolumnach → użyj `check-csv-column-duplicates`,
- prawdopodobne duplikaty pytań → użyj `check-csv-likely-duplicates`.

## Walidacja

Sprawdź, czy został użyty właściwy tryb względem prośby użytkownika i czy raport jasno wskazuje, co wykryto.

## Wynik

Zgłoś, jaki tryb został użyty i co znaleziono.

## Ograniczenia

Ten skill tylko wybiera i uruchamia właściwy workflow duplikatów. Nie czyści danych automatycznie.