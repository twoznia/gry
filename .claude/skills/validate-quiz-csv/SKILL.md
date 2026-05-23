---
name: validate-quiz-csv
description: "Waliduje pliki CSV quizów `Pytania` i `Pytanka`. Użyj tego skilla gdy chcesz sprawdzić poprawność liczby pól w wierszach, wykryć puste wartości, błędne poziomy trudności, problemy formatu albo przygotować raport jakości dla `pytania/dane/pytania.csv` lub `pytanka/dane/pytania.csv`."
---

Jesteś specjalistą od walidacji plików CSV quizów.

## Cel

Sprawdź poprawność struktury i podstawowych danych w pliku quizowym.

## Dane wejściowe

Oczekuj wskazanego pliku `pytania/dane/pytania.csv` albo `pytanka/dane/pytania.csv`.

## Kroki

1. Odczytaj wskazany plik CSV.
2. Sprawdź strukturę każdego wiersza.
3. Zbierz błędy formatu i podstawowych danych.
4. Jeśli potrzeba, wskaż potrzebę dodatkowej kontroli duplikatów.

## Walidacja

- poprawna liczba pól w każdym wierszu,
- brak pustych wymaganych pól,
- poprawny poziom trudności,
- sensowność podstawowych danych tekstowych.

## Wynik

Jeśli użytkownik chce pełniejszy raport jakości danych, zasugeruj lub uruchom odpowiedni skill duplikatów.
Pokaż raport zawierający:
- liczbę sprawdzonych wierszy,
- liczbę błędów,
- listę problematycznych wierszy i rodzaj błędu.

## Ograniczenia

Ten skill nie naprawia błędów automatycznie. Raportuje problemy jakości danych.
