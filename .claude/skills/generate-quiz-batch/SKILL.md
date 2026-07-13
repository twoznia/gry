---
name: generate-quiz-batch
description: "Generuje kolejną paczkę pytań do quizu Pytania na podstawie pytania/tools/kategorie.txt, kontynuując od ostatnio ukończonej subkategorii. Lista subkategorii jest cykliczna — po dojściu do końca zaczyna nową rundę od początku. Opcjonalnie można zawęzić generowanie do jednej kategorii (po nazwie lub pozycji). Użyj gdy użytkownik prosi o wygenerowanie kolejnej partii pytań / kolejnych subkategorii."
---

Jesteś specjalistą od masowego generowania pytań do quizu `Pytania`, w oparciu o listę subkategorii i zapamiętany postęp.

## Pliki, z którymi pracujesz

- `pytania/tools/kategorie.txt` — źródło subkategorii (skonsolidowana lista, format: `Kategoria:` + linie `  - Subkategoria`). **Nie modyfikuj tego pliku.**
- `pytania/tools/postep.txt` — jednolinijkowy plik ze znacznikiem postępu w formacie `Kategoria;Subkategoria` (ostatnia ukończona para, wspólny dla wszystkich kategorii, także przy generowaniu zawężonym do jednej kategorii). Jeśli plik nie istnieje, zacznij od pierwszej pary na liście.
- `pytania/tools/tmp/<yyyymmdd_hhMM>.csv` — plik wyjściowy paczki (nazwa = data i godzina **rozpoczęcia** tego zadania).

## Parametry

- **Rozmiar paczki** — domyślnie **16** subkategorii. Jeśli użytkownik poda inną liczbę w prompcie, użyj jej.
- **Rozkład trudności na subkategorię** — domyślnie **1 łatwe, 2 trudne, 2 bardzo trudne** (5 pytań/subkategorię). Jeśli użytkownik poda inny rozkład, użyj go.
- **Kategoria** (opcjonalnie) — zawęża generowanie do jednej kategorii. Użytkownik może podać:
  - dokładną nazwę kategorii, jak w nagłówku `Kategoria:` w `kategorie.txt` (dopasowanie dokładne, ew. bez rozróżniania wielkości liter), albo
  - pozycję na liście kategorii (1 = pierwsza kategoria występująca w pliku, 2 = druga, itd.).

  Jeśli podana nazwa/pozycja nie istnieje — zgłoś to i wypisz dostępne kategorie z numerami, nie generuj nic. Jeśli parametr nie podany — działaj na wszystkich kategoriach (zachowanie domyślne).

## Kroki

1. **Wczytaj i spłaszcz `kategorie.txt`** — zbuduj listę par `(kategoria, subkategoria)` w kolejności występowania w pliku (kategorie i subkategorie idą jedna po drugiej, tak jak w pliku). Zbuduj też listę samych kategorii w kolejności występowania (do dopasowania parametru Kategoria po pozycji).

2. **Jeśli podano parametr Kategoria** — zmapuj go na nazwę kategorii (po nazwie lub pozycji z listy z kroku 1) i zawęź listę par tylko do tej kategorii, zachowując kolejność subkategorii. Dalsze kroki (3–8) operują na tej zawężonej liście zamiast pełnej.

3. **Wczytaj `postep.txt`**. Znajdź w liście (pełnej lub zawężonej — patrz krok 2) pozycję zapisanej tam pary.
   - Jeśli plik nie istnieje, lub zapisana para nie występuje w aktualnej (zawężonej) liście — zacznij od indeksu 0 tej listy.

4. **Wybierz kolejne N par** (domyślnie 16) występujących bezpośrednio po znaczniku postępu.
   - Jeśli par zostało mniej niż N — weź tylko te, które zostały (paczka mniejsza niż N), **nie dobieraj brakujących z początku listy**. Zatrzymaj się na końcu listy.
   - Jeśli znacznik postępu wskazuje na ostatnią parę na liście (nic więcej nie zostało) — **zacznij nową rundę**: weź kolejne N par od początku listy (indeks 0).

5. **Wygeneruj pytania** dla każdej wybranej pary `(kategoria, subkategoria)` zgodnie z rozkładem trudności z sekcji Parametry. Stosuj format i walidację ze skilla `add-quiz-questions` (8 pól, separator `;`, brak `;` w wartościach, brak pustych pól, dokładnie 3 błędne odpowiedzi, `level` ze zbioru `łatwe/średnie/trudne/bardzo trudne`). Unikaj generowania dwóch identycznych pytań w tej samej paczce.

   **Kolejna runda dla tej samej subkategorii:** zanim wygenerujesz pytania dla pary, która była już generowana wcześniej, sprawdź istniejące pytania Grepem w `pytania/dane/kategorie/<Kategoria>.csv` z filtrem po prefiksie `Kategoria;Subkategoria;` (nie wczytuj całego pliku). Nowe pytania muszą dotyczyć innych faktów niż już istniejące — nie duplikuj treści ani nie parafrazuj tego samego pytania.

   **Kalibracja trudności (ważne):** `bardzo trudne` musi być rzeczywiście trudne — coś, czego nie zna przeciętny dorosły, a już na pewno nie dziecko ze szkoły podstawowej. Test: jeśli fakt jest świętem państwowym, hasłem z podręcznika ("Kazimierz Wielki zastał Polskę drewnianą..."), datą powszechnie kojarzoną (np. 1791 — Konstytucja 3 Maja), albo popularnym faktem ogólnoświatowym (np. Lincoln i zniesienie niewolnictwa, bitwa pod Stalingradem) — to NIE jest `bardzo trudne`, tylko co najwyżej `trudne`/`średnie`. Prawdziwe `bardzo trudne` to np. konkretne kryptonimy operacji, imiona drugoplanowych postaci historycznych, dokładne daty wydarzeń pobocznych, terminologia znana tylko pasjonatom danej dziedziny. Przed zapisaniem pytania jako `bardzo trudne` zadaj sobie pytanie: "czy przeciętne dziecko w Polsce zna tę odpowiedź?" — jeśli tak, obniż poziom albo zamień na bardziej niszowy fakt z tej samej subkategorii.

6. **Zapisz CSV** w `pytania/tools/tmp/`, bez nagłówka, nazwa pliku = data i godzina rozpoczęcia zadania w formacie `yyyymmdd_hhMM.csv` (ustal datę raz, na starcie, np. przez jednorazowe sprawdzenie aktualnego czasu).

7. **Zaktualizuj `postep.txt`** — nadpisz go jedną linią z ostatnią parą `(kategoria, subkategoria)` z właśnie przetworzonej paczki.

8. **Zgłoś wynik** — krótko: czy generowanie było zawężone do jednej kategorii, które subkategorie zostały ujęte (kategoria + zakres), ile pytań wygenerowano, oraz czy ta paczka **zakończyła listę** (mniejsza niż N / doszła do ostatniej pary) — to sygnał, że koniec rundy.

9. **Nie twórz PR-a i nie commituj** — to tylko generowanie pliku roboczego w `tools/tmp`, chyba że użytkownik wyraźnie o to poprosi.

## Uruchamianie w pętli

Ten skill jest zaprojektowany tak, by można było go odpalać wielokrotnie pod rząd (np. przez `/loop /generate-quiz-batch`), za każdym razem kontynuując od miejsca zapisanego w `postep.txt`. Gdy paczka dojdzie do końca listy, skill się zatrzymuje na tym miejscu (nie wypełnia paczki elementami z początku). Kolejne odpalenie po takim zakończeniu rozpoczyna nową rundę od początku listy — więc pętla puszczona bez limitu będzie kontynuować w nieskończoność, rundę po rundzie. Zatrzymaj ją ręcznie, gdy uznasz że wystarczy.
