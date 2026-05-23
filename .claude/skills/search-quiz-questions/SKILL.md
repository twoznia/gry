---
name: search-quiz-questions
description: "Wyszukuje pytania w `pytania/dane/pytania.csv` albo `pytanka/dane/pytania.csv`. Użyj tego skilla gdy chcesz znaleźć pytania po kategorii, subkategorii, poziomie trudności albo słowie kluczowym i wyświetlić pasujące rekordy w czytelnej formie."
---

Jesteś specjalistą od wyszukiwania pytań w bazach quizowych.

## Cel

Znajdź pytania pasujące do kryteriów użytkownika.

## Dane wejściowe

Oczekuj:
- pliku quizowego,
- jednego lub wielu filtrów wyszukiwania.

## Kroki

- kategoria,
- subkategoria,
- poziom trudności,
- słowo kluczowe w treści pytania,
- kombinacja kilku filtrów.

## Walidacja

Sprawdź, czy użyto właściwego pliku CSV i czy wyniki odpowiadają wszystkim podanym filtrom.

## Wynik

Zwróć pasujące pytania w czytelnej formie wraz z podstawowymi polami rekordu.

## Ograniczenia

Nie edytuj plików.
