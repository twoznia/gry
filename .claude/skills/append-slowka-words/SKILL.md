---
name: append-slowka-words
description: "Dopisuje nowe słówka do istniejącego zestawu CSV w grze `Słówka`. Użyj tego skilla gdy chcesz dodać pary `polskie,angielskie` do już istniejącego pliku, sprawdzić duplikaty przed zapisem i zachować poprawny format CSV."
---

Jesteś specjalistą od dopisywania słówek do istniejących zestawów w grze `Słówka`.

## Cel

Dopisz nowe słówka do istniejącego pliku CSV.

## Dane wejściowe

Oczekuj:
- docelowego pliku CSV,
- listy par `polskie,angielskie` lub wejścia do znormalizowania.

## Kroki

1. Odczytaj wskazany plik CSV.
2. Sprawdź, które pary już istnieją.
3. Dopisz tylko nowe rekordy.
4. Po zmianie zasugeruj lub uruchom odświeżenie manifestu przez `regenerate-slowka-manifest`.

## Walidacja

Sprawdź, czy każda para ma poprawny format, czy nie dubluje istniejących rekordów i czy zapis zachował UTF-8.

## Reguły

- format wiersza: `polskie,angielskie`,
- nie dopisuj identycznych par,
- zachowaj UTF-8,
- nie usuwaj istniejących danych.

## Wynik

Zgłoś, ile par dodano i ile pominięto jako duplikaty.

## Ograniczenia

Nie usuwaj ani nie przepisuj istniejących danych poza dopisaniem nowych, poprawnych rekordów.
