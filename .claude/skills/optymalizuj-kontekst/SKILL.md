---
name: optymalizuj-kontekst
description: "Tryb oszczędzania kontekstu/tokenów w repo twoznia/gry. Użyj tego skilla gdy użytkownik mówi 'oszczędzaj tokeny', 'optymalizuj kontekst', 'za szybko tracę tokeny', 'pracuj oszczędnie', albo zaczyna nowe zadanie i chce ograniczyć zużycie. Skill ustala oszczędny sposób pracy: ocenia czy historia jest potrzebna (i prosi o /clear), oraz ładuje do kontekstu tylko fragment kodu potrzebny do zadania."
---

Jesteś w trybie oszczędzania kontekstu. Cel: wykonać zadanie zużywając jak
najmniej tokenów, bez utraty jakości.

## Najpierw zdecyduj o historii

Koszt rośnie z długością rozmowy — przy każdej turze model dostaje całą
dotychczasową historię. Dlatego na starcie zadania oceń:

- **Czy to zadanie potrzebuje wcześniejszej rozmowy?** Jeśli jest niezależne od
  tego, co było wcześniej (inna gra, inny temat, świeży problem) — **poproś
  użytkownika, żeby zrobił `/clear`** i wkleił to zadanie w nowej, czystej sesji.
  Powiedz to jednym zdaniem na początku, np.:
  > To zadanie nie wymaga naszej dotychczasowej rozmowy — zrób `/clear` i wklej je
  > ponownie, oszczędzisz sporo tokenów. Jeśli wolisz kontynuować tu, działam dalej.

- **Ważne ograniczenie:** `/clear` i `/compact` uruchamia użytkownik w terminalu.
  Ty ich NIE wywołasz — możesz tylko zarekomendować. Nie udawaj, że je wykonałeś.

- Jeśli zadanie **wymaga** wcześniejszego kontekstu, ale rozmowa jest już długa —
  zaproponuj `/compact` (streszcza kontekst zamiast wozić go w całości).

Nie blokuj pracy: jeśli użytkownik nie reaguje na sugestię `/clear`, po prostu
działaj dalej w trybie oszczędnym.

## Ładuj tylko potrzebny fragment kodu

To druga główna oszczędność. Nie wczytuj wielkich plików w całości.

- Najpierw **zlokalizuj** miejsce zmiany przez `Grep` (wzorzec, nazwa funkcji,
  selektor) albo `Glob`. Dopiero potem `Read` z `offset`/`limit`, żeby pobrać
  tylko ten wycinek (np. ±30 linii wokół trafienia).
- Pliki w tym repo bywają duże (`soltaire` ~1600, `koloruj` ~1300, `tetris`
  ~1100, pełne gry reflex). Pełny `Read` takiego pliku to często zbędny koszt —
  rób to tylko, gdy naprawdę musisz zobaczyć całość.
- **Nie czytaj ponownie** pliku/fragmentu, który już jest w kontekście tej sesji.
- Do podmian używaj `Edit` z minimalnym, unikalnym `old_string` — nie przepisuj
  całych plików, gdy wystarczy fragment.
- Przy szukaniu po repo preferuj `Grep`/`Glob` zamiast czytania wielu plików „na
  wszelki wypadek".

## Inne tanie nawyki

- **Łącz niezależne wywołania narzędzi** w jednej turze (równolegle), zamiast
  rozbijać na wiele tur.
- **Dobierz model do zadania** — proste edycje/rename/porządki świetnie zrobi
  tańszy model; zaproponuj użytkownikowi `/model` (np. Sonnet/Haiku) i `/fast`
  tylko gdy realnie potrzebny.
- **Nie wklejaj dużych zrzutów** (całych plików, długich logów) do odpowiedzi,
  jeśli wystarczy odnośnik `plik:linia` albo krótki fragment.
- Jeśli zadanie jest wieloczęściowe i części są niezależne — zaproponuj zrobienie
  ich w osobnych sesjach z `/clear` między nimi.

## Czego NIE robić

- Nie udawaj wykonania `/clear` ani `/compact`.
- Nie pomijaj czytania kodu, który jest naprawdę potrzebny do poprawnej zmiany —
  oszczędność nie może prowadzić do zgadywania i błędów.
- Nie zmieniaj zachowania merytorycznego zadania w imię oszczędności.

## Na koniec

Jeśli to sensowne, dodaj jedno zdanie podsumowania: ile udało się ograniczyć
(np. „czytałem tylko 2 fragmenty zamiast całych plików") i czy następne zadanie
warto zacząć od `/clear`.
