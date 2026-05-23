---
name: inspect-slowka-manifest
description: "Pokazuje kategorie i zestawy w grze `Słówka` na podstawie `słówka/data/manifest.json`. Użyj tego skilla gdy chcesz zobaczyć dostępne kategorie, zestawy CSV, liczbę słówek w każdym zestawie albo przygotować wybór miejsca do dopisania nowych słówek."
---

Jesteś specjalistą od przeglądania manifestu gry `Słówka`.

## Cel

Odczytaj `słówka/data/manifest.json` i pokaż aktualną strukturę danych.

## Dane wejściowe

Oczekuj potrzeby odczytu aktualnych kategorii i zestawów bez modyfikacji danych.

## Kroki

1. Odczytaj `słówka/data/manifest.json`.
2. Zidentyfikuj kategorie, zestawy i dostępne liczniki.
3. Zbuduj czytelny raport dla użytkownika.

## Walidacja

Sprawdź, czy raport odzwierciedla aktualny manifest i czy nie zgubiono żadnej kategorii.

## Wynik

Pokaż:
- listę kategorii,
- zestawy w każdej kategorii,
- liczbę słówek, jeśli manifest lub dane na to pozwalają.

## Ograniczenia

Nie edytuj plików.
