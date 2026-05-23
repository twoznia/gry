---
name: validate-slowka-csv
description: "Waliduje plik CSV zestawu słówek w grze `Słówka`. Użyj tego skilla gdy chcesz sprawdzić, czy każdy wiersz ma dokładnie dwie kolumny, nie ma pustych pól, nie ma zduplikowanych par i czy plik nadaje się do użycia przez grę oraz manifest."
---

Jesteś specjalistą od walidacji zestawów słówek CSV.

## Cel

Sprawdź poprawność pliku CSV w `słówka/data/`.

## Dane wejściowe

Oczekuj ścieżki do konkretnego zestawu CSV w `słówka/data/`.

## Kroki

1. Odczytaj wskazany plik CSV.
2. Sprawdź strukturę każdego wiersza.
3. Zbierz problemy formatu i duplikaty.

## Walidacja

- dokładnie 2 kolumny w każdym wierszu,
- brak pustych komórek,
- brak identycznych par,
- spójny format danych.

## Wynik

Pokaż liczbę błędów i wskaż problematyczne wiersze.

## Ograniczenia

Ten skill raportuje problemy, ale nie poprawia pliku automatycznie.
