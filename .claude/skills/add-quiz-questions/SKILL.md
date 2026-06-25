---
name: add-quiz-questions
description: "Dopisuje pytania do pytania/dane/pytania.csv lub pytanka/dane/pytania.csv. Użyj gdy użytkownik podaje pytania do quizu lub prosi o dodanie pytań."
---

Jesteś specjalistą od dopisywania pytań do quizów `Pytania` i `Pytanka`.

## Format plików

### `pytania/dane/pytania.csv` (quiz dla dorosłych)
```
category;subcategory;level;question;correct;wrong1;wrong2;wrong3
```
- **8 pól**, separator `;`, kodowanie UTF-8, bez nagłówka (nagłówek jest tylko w pierwszej linii pliku)
- Wymaga **3 błędnych odpowiedzi** (`wrong1`, `wrong2`, `wrong3`)

### `pytanka/dane/pytania.csv` (quiz dla dzieci)
```
category;subcategory;level;question;correct;wrong1;wrong2
```
- **7 pól**, separator `;`, kodowanie UTF-8
- Wymaga **2 błędnych odpowiedzi** (`wrong1`, `wrong2`)

## Poziomy trudności

Dozwolone wartości pola `level`:
- `łatwe`
- `średnie`
- `trudne`
- `bardzo trudne`

## Istniejące kategorie w `pytania`

Film i Telewizja, Geografia i Turystyka, Historia, Kulinaria i Smaki, Literatura i Język, Motoryzacja i Transport, Muzyka, Nauka i Odkrycia, Przyroda i Biologia, Rozrywka i Popkultura, Sport, Społeczeństwo i Prawo, Sztuka i Architektura, Technologie i IT, Tradycje i Religie, Wiedza Ogólna i Ciekawostki

Nowe kategorie są dozwolone — stosuj spójną stylistykę (pierwsze litery wielkie, po polsku).

## Kroki

1. **Ustal plik docelowy** — `pytania` lub `pytanka`. Jeśli nie podano, zapytaj.

2. **Przekonwertuj pytania do formatu CSV** — każde pytanie to jeden wiersz, pola oddzielone `;`. Żadne pole nie może być puste. Nie używaj cudzysłowów ani escaping'u — wartości nie powinny zawierać `;`.

3. **Sprawdź duplikaty** — odczytaj plik docelowy i porównaj treść pytania (`question`). Jeśli identyczne pytanie już istnieje, pomiń je.

4. **Dopisz nowe wiersze** — dołącz na końcu pliku. Nie modyfikuj istniejących wierszy, nie zmieniaj nagłówka.

5. **Zgłoś wynik** — ile pytań dodano, ile pominięto i dlaczego (duplikat / błąd walidacji).

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
