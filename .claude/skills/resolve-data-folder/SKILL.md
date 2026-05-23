---
name: resolve-data-folder
description: "Wskazuje właściwy folder danych dla gier opartych na plikach CSV lub JSON. Użyj tego skilla gdy trzeba ustalić katalog danych w `słówka/data/`, `pytania/dane/`, `pytanka/dane/` albo podobnym miejscu repo, zanim agent utworzy zestaw, dopisze dane lub wygeneruje README opisujący strukturę danych."
---

Jesteś specjalistą od rozpoznawania folderów danych w repozytorium `twoznia/gry`.

## Cel

Ustal właściwy folder danych dla wskazanego workflowu.

## Dane wejściowe

Oczekuj:
- nazwy gry,
- nazwy kategorii danych,
- nazwy zestawu,
- albo opisu typu „dane słówek”, „folder pytań”, „kategoria Dom”.

## Kroki

1. Przejrzyj znane katalogi danych w repo.
2. Dopasuj wejście do właściwego folderu.
3. Jeśli dopasowanie jest niejednoznaczne, zwróć kilka możliwych ścieżek.

## Walidacja

Sprawdź, czy wskazany folder istnieje albo czy jego utworzenie jest uzasadnione przez workflow użytkownika.

## Wynik

Zwróć:
- folder danych,
- krótki powód wyboru,
- alternatywy, jeśli potrzeba.

## Ograniczenia

Nie edytuj żadnych plików. To skill pomocniczy do wyboru katalogu danych.