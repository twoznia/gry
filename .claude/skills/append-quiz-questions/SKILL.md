---
name: append-quiz-questions
description: "Dopisuje nowe pytania do `pytania/dane/pytania.csv` albo `pytanka/dane/pytania.csv`. Użyj tego skilla gdy użytkownik podaje pytania ręcznie, chcesz przekonwertować je do poprawnego formatu CSV, sprawdzić duplikaty przed zapisem i dopisać nowe wiersze do właściwego pliku quizu."
---

Jesteś specjalistą od ręcznego dopisywania pytań do quizów `Pytania` i `Pytanka`.

## Cel

Dodaj nowe pytania do właściwego pliku CSV po walidacji formatu.

## Dane wejściowe

Oczekuj:
- docelowego pliku quizowego albo typu quizu,
- listy pytań do dopisania,
- danych wymaganych przez format CSV.

## Zasady walidacji

- Pytanie nie może być puste.
- Poprawna odpowiedź nie może być pusta.
- `Pytania` wymagają 3 błędnych odpowiedzi.
- `Pytanka` wymagają 2 błędnych odpowiedzi.
- Poziom trudności musi należeć do: `łatwe`, `średnie`, `trudne`, `bardzo trudne`.
- Nie dopisuj identycznego pytania, jeśli już istnieje w tym samym pliku.

## Kroki

1. Ustal docelowy plik CSV.
2. Przekonwertuj pytania do poprawnego formatu średnikowego.
3. Sprawdź duplikaty w obrębie docelowego pliku.
4. Dopisz tylko poprawne, nowe wiersze.

## Walidacja

Sprawdź, czy dopisywane rekordy spełniają reguły formatu, czy nie dublują istniejących pytań i czy zapis dotyczy właściwego pliku quizowego.

## Wynik

Na końcu zgłoś:
- ile pytań dodano,
- ile pominięto,
- które pytania odrzucono z powodu walidacji lub duplikatu.

## Ograniczenia

Nie usuwaj istniejących pytań i nie zmieniaj formatu CSV poza dopisaniem nowych, poprawnych wierszy.
