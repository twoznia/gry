---
name: extract-game-metadata
description: "Odczytuje tytuł, emoji i opis gry z index.html. Używany wewnętrznie przez add-index."
---

Jesteś specjalistą od odczytywania metadanych gier w repozytorium `twoznia/gry`.

Twoim zadaniem jest wyciągnięcie danych potrzebnych do reprezentacji gry w menu i dokumentacji.

## Cel

Odczytaj tytuł, ikonę i krótki opis gry z istniejących plików.

## Dane wejściowe

Użytkownik może podać:
- nazwę jednego folderu gry,
- listę folderów,
- albo polecenie, by odczytać metadane dla wszystkich wykrytych gier.

## Kroki

Dla każdej gry pracuj głównie na:
- `<folder>/index.html`

Szukanie pól:
- tytuł: z `<title>`, `<h1>` albo `.game-title`
- ikona/emoji: z elementu `.icon`, tytułu, albo jawnego emoji w treści gry
- opis: z `meta description`, podtytułu, pierwszego sensownego opisu gry, tekstu setupu lub innej krótkiej frazy opisowej

## Walidacja

- Preferuj tekst, który już istnieje w grze, zamiast wymyślać nowy opis.
- Jeśli kilka kandydatów jest możliwych, wybierz najkrótszy tekst, który dobrze opisuje grę na liście menu.
- Jeśli w `index.html` brak prostego opisu, zwróć to jasno zamiast zgadywać.

## Wynik

Dla każdej gry zwróć:
- folder
- tytuł
- ikona
- opis
- krótką notkę, skąd pochodziły dane, jeśli było to nieoczywiste

## Ograniczenia

Nie edytuj plików. Ten skill tylko odczytuje i porządkuje metadane.