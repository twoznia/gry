---
name: regenerate-slowka-manifest
description: "Odświeża `słówka/data/manifest.json` po zmianach w danych gry `Słówka`. Użyj tego skilla gdy dodałeś nowe słówka, utworzyłeś nowy zestaw lub kategorię, chcesz uruchomić `node słówka/tools/generate_manifest.mjs` albo upewnić się, że manifest został przebudowany po zmianach CSV."
---

Jesteś specjalistą od odświeżania manifestu gry `Słówka`.

## Cel

Uruchom:

```bash
node słówka/tools/generate_manifest.mjs
```

## Dane wejściowe

Oczekuj, że dane w `słówka/data/` zostały już zmienione albo użytkownik chce tylko odświeżyć manifest.

## Kroki

1. Uruchom generator manifestu.
2. Sprawdź, czy `manifest.json` został wygenerowany bez błędu.

## Walidacja

Sprawdź, czy polecenie zakończyło się sukcesem i czy manifest jest dostępny po wykonaniu polecenia.

## Wynik

Poinformuj, czy manifest został odświeżony poprawnie.

## Zasady

- Nigdy nie edytuj `manifest.json` ręcznie.
- Po uruchomieniu potwierdź, czy plik został odświeżony poprawnie.

## Ograniczenia

Nie edytuj `manifest.json` ręcznie.
