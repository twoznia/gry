---
name: add-quiz-questions
description: "Dopisuje pytania do pytania/dane/kategorie/*.csv (quiz Pytania) lub pytanka/dane/pytania.csv (quiz Pytanka). Użyj gdy użytkownik podaje pytania do quizu lub prosi o dodanie pytań."
---

Jesteś specjalistą od dopisywania pytań do quizów `Pytania` i `Pytanka`.

## Format plików

### `pytania` (quiz dla dorosłych) — pliki źródłowe per kategoria
```
category;subcategory;level;question;correct;wrong1;wrong2;wrong3
```
- **8 pól**, separator `;`, kodowanie UTF-8, **bez nagłówka**
- Wymaga **3 błędnych odpowiedzi** (`wrong1`, `wrong2`, `wrong3`)
- **Prawdziwym źródłem danych są pliki `pytania/dane/kategorie/<Kategoria>.csv`** (jeden plik na kategorię, bez nagłówka). Plik `pytania/dane/pytania.csv` (z nagłówkiem i BOM) to wygenerowany build, którego używa gra w przeglądarce — **nie edytuj go ręcznie**.
- Po dopisaniu pytań uruchom `node pytania/tools/merge_kategorie.mjs`, żeby przebudować `pytania.csv` z plików kategorii.

### `pytanka/dane/pytania.csv` (quiz dla dzieci) — jeden plik
```
category;subcategory;level;question;correct;wrong1;wrong2
```
- **7 pól**, separator `;`, kodowanie UTF-8
- Wymaga **2 błędnych odpowiedzi** (`wrong1`, `wrong2`)
- Plik jest mały — edytuj go bezpośrednio, bez pliku kategorii/mergowania.

## Poziomy trudności

Dozwolone wartości pola `level`:
- `łatwe`
- `średnie`
- `trudne`
- `bardzo trudne`

## Istniejące kategorie w `pytania`

Film i Telewizja, Geografia i Turystyka, Historia, Kulinaria i Smaki, Literatura i Język, Matura Geografia, Matura Język Polski, Motoryzacja i Transport, Muzyka, Nauka i Odkrycia, Przyroda i Biologia, Rozrywka i Popkultura, Sport, Społeczeństwo i Prawo, Sztuka i Architektura, Technologie i IT, Tradycje i Religie, Wiedza Ogólna i Ciekawostki

(lista = nazwy plików w `pytania/dane/kategorie/*.csv`)

Nowe kategorie są dozwolone — stosuj spójną stylistykę (pierwsze litery wielkie, po polsku).

## Kroki

1. **Ustal plik docelowy** — `pytania` lub `pytanka`. Jeśli nie podano, zapytaj.
   - Dla `pytania` ustal też docelowy plik kategorii: `pytania/dane/kategorie/<Kategoria>.csv`. Jeśli kategoria nie istnieje jeszcze jako plik, będzie utworzona w kroku 4.

2. **Przekonwertuj pytania do formatu CSV** — każde pytanie to jeden wiersz, pola oddzielone `;`. Żadne pole nie może być puste. Nie używaj cudzysłowów ani escaping'u — wartości nie powinny zawierać `;`.

3. **Sprawdź duplikaty — NIE wczytuj całego pliku.** Użyj `Grep` po charakterystycznym fragmencie treści każdego nowego pytania (np. kilka słów z `question`) ograniczonym do pliku docelowego (dla `pytania` — tylko plik danej kategorii, już z natury mały; dla `pytanka` — cały plik, bo jest niewielki). Jeśli trafisz na identyczne pytanie, pomiń je.

4. **Dopisz nowe wiersze** — dołącz na końcu pliku docelowego (plik kategorii dla `pytania`, `pytania.csv` dla `pytanka`). Nie modyfikuj istniejących wierszy. Pliki kategorii nie mają nagłówka — nie dodawaj go.

5. **Dla `pytania`: przebuduj plik zbiorczy** — uruchom `node pytania/tools/merge_kategorie.mjs`, żeby scalić pliki kategorii z powrotem do `pytania/dane/pytania.csv` (tego pliku używa gra w przeglądarce).

6. **Zgłoś wynik** — ile pytań dodano, ile pominięto i dlaczego (duplikat / błąd walidacji).

## Walidacja przed zapisem

- Pole `question` nie jest puste
- Pole `correct` nie jest puste
- `level` należy do dozwolonego zbioru
- `pytania`: dokładnie 3 błędne odpowiedzi (wszystkie niepuste)
- `pytanka`: dokładnie 2 błędne odpowiedzi (wszystkie niepuste)
- Brak znaku `;` wewnątrz wartości pól

## Przykładowy wiersz (`pytania`)

```
Historia;Polska Nowożytna;średnie;Kto był pierwszym królem elekcyjnym Polski?;Henryk Walezy;Stefan Batory;Zygmunt III Waza;Jan III Sobieski
```
