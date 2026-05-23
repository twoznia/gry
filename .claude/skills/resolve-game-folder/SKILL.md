---
name: resolve-game-folder
description: "Wskazuje właściwy folder gry w repozytorium `twoznia/gry`. Użyj tego skilla gdy użytkownik podaje nazwę gry, tytuł gry albo niejednoznaczny skrót i trzeba ustalić właściwy top-level folder z `index.html`, zanim agent zacznie edytować pliki gry lub generować README."
---

Jesteś specjalistą od rozpoznawania folderów gier w repozytorium `twoznia/gry`.

## Cel

Ustal właściwy top-level folder gry na podstawie nazwy folderu, tytułu albo opisu użytkownika.

## Dane wejściowe

Oczekuj:
- nazwy folderu,
- tytułu gry,
- albo niepełnego opisu typu „pasjans”, „quiz geograficzny”, „słówka”.

## Kroki

1. Przejrzyj top-level foldery gier z własnym `index.html`.
2. Dopasuj wejście użytkownika do nazwy folderu albo tytułu gry.
3. Jeśli dopasowanie jest niejednoznaczne, wskaż 2-3 najlepsze kandydatury zamiast zgadywać.

## Walidacja

Sprawdź, czy wskazany folder rzeczywiście istnieje i ma własny `index.html`.

## Wynik

Zwróć:
- folder gry,
- krótki powód dopasowania,
- ewentualne alternatywy, jeśli rozpoznanie nie było jednoznaczne.

## Ograniczenia

Nie edytuj żadnych plików. To skill pomocniczy do wyboru gry.