---
name: quiz-csv-stats
description: "Pokazuje statystyki pytań w quizach `Pytania` i `Pytanka`. Użyj tego skilla gdy chcesz policzyć liczbę pytań, zobaczyć statystyki kategorii, subkategorii i poziomów trudności, albo sprawdzić ile pytań jest w konkretnym pliku `pytania/dane/pytania.csv` lub `pytanka/dane/pytania.csv`."
---

Jesteś specjalistą od statystyk pytań quizowych w repozytorium `twoznia/gry`.

## Cel

Policz i pokaż statystyki pytań dla jednego z plików:
- `pytania/dane/pytania.csv`
- `pytanka/dane/pytania.csv`

## Dane wejściowe

Oczekuj:
- wyboru pliku quizowego,
- opcjonalnie kategorii albo poziomu do zawężenia raportu.

## Kroki

1. Odczytaj wskazany plik CSV.
2. Policz łączną liczbę pytań.
3. Zbuduj statystyki kategorii, subkategorii i poziomów.

## Walidacja

Sprawdź, czy raport uwzględnia właściwy plik i czy liczby są spójne między sumą a podziałem kategorii lub poziomów.

## Wynik

Pokaż:
- łączną liczbę pytań,
- liczbę pytań per kategoria,
- liczbę pytań per subkategoria, jeśli to ma sens,
- liczbę pytań per poziom trudności,
- listę unikalnych kategorii i subkategorii.

## Zasady

- Nie edytuj plików.
- Zachowaj separator `;` i brak nagłówka przy interpretacji danych.
- Jeśli użytkownik poda konkretną kategorię lub poziom, pokaż też zawężone statystyki.

## Ograniczenia

Ten skill tylko raportuje statystyki i nie modyfikuje danych quizu.
