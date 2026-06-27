# Zasady generowania pytań quizowych (`pytania/data/*.json`)

Plik opisuje reguły, według których model AI generuje pytania dodawane przez narzędzie `pytania/tools/add_questions.mjs`.

---

## Język

Wszystkie pytania i odpowiedzi **muszą być w języku polskim**.

---

## Limity długości

| Pole | Maksymalna długość |
|------|-------------------|
| `question` | **200 znaków** |
| `text` poprawnej odpowiedzi (`is_correct: true`) | **50 znaków** |
| `text` błędnych odpowiedzi | bez ograniczeń |

---

## Poziomy trudności

Dozwolone wartości pola `level`:

| Wartość | Opis |
|---------|------|
| `łatwe` | Wiedza powszechna, fakty znane większości |
| `średnie` | Wymaga pewnej wiedzy z danej dziedziny |
| `trudne` | *(domyślny)* Wiedza szczegółowa |
| `bardzo trudne` | Wiedza ekspercka, szczegóły mało znane |

---

## Format odpowiedzi

Każde pytanie musi zawierać **dokładnie 4 odpowiedzi**, z których **dokładnie 1** ma `is_correct: true`.

Model zwraca **tablicę** pytań. Każdy element ma jedno poprawne pole `correct`
i dokładnie 3 błędne odpowiedzi w `wrong`:

```json
[
  { "question": "...", "correct": "...", "wrong": ["...", "...", "..."] }
]
```

Narzędzie zapisuje je do CSV w formacie:
`category;subcategory;level;question;correct;wrong1;wrong2;wrong3`

---

## Unikanie duplikatów

Nowe pytanie **nie może być dodane**, jeśli w `pytania/dane/pytania.csv` istnieje już pytanie o identycznym (po normalizacji: trim, małe litery, scalone spacje) tekście — niezależnie od subkategorii. Sprawdzane są też pytania dodane w tym samym przebiegu.

---

## Jakość treści

- Pytanie musi dotyczyć ściśle podanej kategorii (`category`) i subkategorii (`subcategory`).
- Odpowiedź poprawna musi być **merytorycznie weryfikowalna** (nie opinia, nie spekulacja).
- Odpowiedzi błędne powinny być **wiarygodne** (nie absurdalne „ślepe" opcje) – utrudnia to zgadywanie.
- Treść nie może zawierać treści obraźliwych, dyskryminacyjnych ani naruszających prawa autorskie.

---

## Prompt wysyłany do modelu

Przykładowy prompt generowany przez skrypt dla `category = "Muzyka"`, `subcategory = "Fryderyk Chopin i Klasyka"`, `level = "trudne"`, `n = 10`:

```
Jesteś generatorem pytań quizowych w języku polskim.

Wygeneruj 10 RÓŻNYCH pytań quizowych dla kategorii "Muzyka", subkategorii "Fryderyk Chopin i Klasyka".
Poziom trudności: trudne

NIE powtarzaj poniższych istniejących pytań (ani ich parafraz):
- ...

Zasady:
- Pytania i odpowiedzi w języku polskim
- Każde pytanie maksymalnie 200 znaków
- Poprawna odpowiedź maksymalnie 50 znaków
- Dokładnie 1 poprawna odpowiedź i dokładnie 3 błędne
- ŻADNE pole nie może zawierać znaku średnika ";" ani znaku nowej linii
- Pytania merytorycznie poprawne, weryfikowalne, ściśle związane z subkategorią
- Błędne odpowiedzi wiarygodne (nie absurdalne), różne od poprawnej

Odpowiedz WYŁĄCZNIE tablicą JSON (bez markdown, bez komentarzy):
[
  { "question": "...", "correct": "...", "wrong": ["...", "...", "..."] }
]
```
