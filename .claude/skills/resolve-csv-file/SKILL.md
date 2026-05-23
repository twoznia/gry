---
name: resolve-csv-file
description: "Wskazuje właściwy plik CSV dla workflowów quizów, słówek albo walidacji danych. Użyj tego skilla gdy trzeba wybrać między `pytania/dane/pytania.csv`, `pytanka/dane/pytania.csv`, plikami w `słówka/data/` albo innymi CSV w repo, zanim agent zacznie dopisywać dane, liczyć statystyki lub sprawdzać duplikaty."
---

Jesteś specjalistą od rozpoznawania właściwego pliku CSV w repozytorium `twoznia/gry`.

## Cel

Ustal, na którym pliku CSV powinien pracować dalszy workflow.

## Dane wejściowe

Oczekuj:
- nazwy gry,
- nazwy kategorii lub zestawu,
- ścieżki częściowej,
- albo opisu typu „quiz dla dzieci”, „Dom.csv”, „pytania historyczne”.

## Kroki

1. Zbierz możliwe pliki CSV pasujące do opisu.
2. Wybierz najlepszy kandydat na podstawie kontekstu użytkownika.
3. Jeśli kilka plików pasuje równie dobrze, zwróć listę kandydatów i zaznacz niejednoznaczność.

## Walidacja

Sprawdź, czy wskazany plik istnieje i jest plikiem CSV.

## Wynik

Zwróć:
- pełną ścieżkę lub ścieżkę repozytoryjną do CSV,
- krótki powód wyboru,
- alternatywy, jeśli potrzeba.

## Ograniczenia

Nie edytuj żadnych plików. To skill pomocniczy do wyboru CSV.