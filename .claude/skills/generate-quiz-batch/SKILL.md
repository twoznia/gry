---
name: generate-quiz-batch
description: "Generuje kolejną paczkę pytań do quizu Pytania na podstawie pytania/tools/kategorie.txt, kontynuując od ostatnio ukończonej subkategorii. Użyj gdy użytkownik prosi o wygenerowanie kolejnej partii pytań / kolejnych subkategorii."
---

Jesteś specjalistą od masowego generowania pytań do quizu `Pytania`, w oparciu o listę subkategorii i zapamiętany postęp.

## Pliki, z którymi pracujesz

- `pytania/tools/kategorie.txt` — źródło subkategorii (skonsolidowana lista, format: `Kategoria:` + linie `  - Subkategoria`). **Nie modyfikuj tego pliku.**
- `pytania/tools/postep.txt` — jednolinijkowy plik ze znacznikiem postępu w formacie `Kategoria;Subkategoria` (ostatnia ukończona para). Jeśli plik nie istnieje, zacznij od pierwszej pary na liście.
- `pytania/tools/tmp/<yyyymmdd_hhMM>.csv` — plik wyjściowy paczki (nazwa = data i godzina **rozpoczęcia** tego zadania).

## Parametry

- **Rozmiar paczki** — domyślnie **16** subkategorii. Jeśli użytkownik poda inną liczbę w prompcie, użyj jej.
- **Rozkład trudności na subkategorię** — domyślnie **1 łatwe, 2 trudne, 2 bardzo trudne** (5 pytań/subkategorię). Jeśli użytkownik poda inny rozkład, użyj go.

## Kroki

1. **Wczytaj i spłaszcz `kategorie.txt`** — zbuduj listę par `(kategoria, subkategoria)` w kolejności występowania w pliku (kategorie i subkategorie idą jedna po drugiej, tak jak w pliku).

2. **Wczytaj `postep.txt`**. Znajdź w spłaszczonej liście pozycję zapisanej tam pary. Jeśli plik nie istnieje — zacznij od indeksu 0.

3. **Wybierz kolejne N par** (domyślnie 16) występujących bezpośrednio po znaczniku postępu.
   - Jeśli par zostało mniej niż N — weź wszystkie pozostałe.
   - Jeśli znacznik postępu wskazuje na ostatnią parę na liście (nic więcej nie zostało) — **nie generuj nic**, zgłoś użytkownikowi, że wszystkie subkategorie zostały już ukończone, i zakończ zadanie tutaj (nie twórz pustego pliku CSV, nie zmieniaj `postep.txt`).

4. **Wygeneruj pytania** dla każdej wybranej pary `(kategoria, subkategoria)` zgodnie z rozkładem trudności z sekcji Parametry. Stosuj format i walidację ze skilla `add-quiz-questions` (8 pól, separator `;`, brak `;` w wartościach, brak pustych pól, dokładnie 3 błędne odpowiedzi, `level` ze zbioru `łatwe/średnie/trudne/bardzo trudne`). Unikaj generowania dwóch identycznych pytań w tej samej paczce.

   **Kalibracja trudności (ważne):** `bardzo trudne` musi być rzeczywiście trudne — coś, czego nie zna przeciętny dorosły, a już na pewno nie dziecko ze szkoły podstawowej. Test: jeśli fakt jest świętem państwowym, hasłem z podręcznika ("Kazimierz Wielki zastał Polskę drewnianą..."), datą powszechnie kojarzoną (np. 1791 — Konstytucja 3 Maja), albo popularnym faktem ogólnoświatowym (np. Lincoln i zniesienie niewolnictwa, bitwa pod Stalingradem) — to NIE jest `bardzo trudne`, tylko co najwyżej `trudne`/`średnie`. Prawdziwe `bardzo trudne` to np. konkretne kryptonimy operacji, imiona drugoplanowych postaci historycznych, dokładne daty wydarzeń pobocznych, terminologia znana tylko pasjonatom danej dziedziny. Przed zapisaniem pytania jako `bardzo trudne` zadaj sobie pytanie: "czy przeciętne dziecko w Polsce zna tę odpowiedź?" — jeśli tak, obniż poziom albo zamień na bardziej niszowy fakt z tej samej subkategorii.

5. **Zapisz CSV** w `pytania/tools/tmp/`, bez nagłówka, nazwa pliku = data i godzina rozpoczęcia zadania w formacie `yyyymmdd_hhMM.csv` (ustal datę raz, na starcie, np. przez jednorazowe sprawdzenie aktualnego czasu).

6. **Zaktualizuj `postep.txt`** — nadpisz go jedną linią z ostatnią parą `(kategoria, subkategoria)` z właśnie przetworzonej paczki.

7. **Zgłoś wynik** — krótko: które subkategorie zostały ujęte (kategoria + zakres), ile pytań wygenerowano, ile par zostało jeszcze do zrobienia w `kategorie.txt`.

8. **Nie twórz PR-a i nie commituj** — to tylko generowanie pliku roboczego w `tools/tmp`, chyba że użytkownik wyraźnie o to poprosi.

## Uruchamianie w pętli

Ten skill jest zaprojektowany tak, by można było go odpalać wielokrotnie pod rząd (np. przez `/loop /generate-quiz-batch`), za każdym razem kontynuując od miejsca zapisanego w `postep.txt`. Pętlę należy zatrzymać, gdy skill zgłosi w kroku 3, że subkategorie się skończyły.
