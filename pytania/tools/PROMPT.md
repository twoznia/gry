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

```json
{
  "subcategory": "...",
  "question":    "...",
  "level":       "łatwe|średnie|trudne|bardzo trudne",
  "answers": [
    { "text": "...", "is_correct": true  },
    { "text": "...", "is_correct": false },
    { "text": "...", "is_correct": false },
    { "text": "...", "is_correct": false }
  ]
}
```

---

## Unikanie duplikatów

Nowe pytanie **nie może być dodane**, jeśli w tym samym pliku i tej samej `subcategory` istnieje już pytanie o identycznym (lub bardzo podobnym, case-insensitive) tekście `question`.

---

## Jakość treści

- Pytanie musi dotyczyć ściśle podanej kategorii (`category`) i subkategorii (`subcategory`).
- Odpowiedź poprawna musi być **merytorycznie weryfikowalna** (nie opinia, nie spekulacja).
- Odpowiedzi błędne powinny być **wiarygodne** (nie absurdalne „ślepe" opcje) – utrudnia to zgadywanie.
- Treść nie może zawierać treści obraźliwych, dyskryminacyjnych ani naruszających prawa autorskie.

---

## Prompt wysyłany do modelu

Przykładowy prompt generowany przez skrypt dla `category = "Muzyka"`, `subcategory = "Fryderyk Chopin i Klasyka"`, `level = "trudne"`, `topic = "sonaty"`:

```
Jesteś generatorem pytań quizowych w języku polskim.

Wygeneruj 1 pytanie quizowe dla kategorii "Muzyka", subkategorii "Fryderyk Chopin i Klasyka".
Dodatkowy kontekst/temat: sonaty
Poziom trudności: trudne

Zasady:
- Pytanie w języku polskim, maksymalnie 200 znaków
- Poprawna odpowiedź maksymalnie 50 znaków
- Dokładnie 4 odpowiedzi, dokładnie 1 poprawna (is_correct: true)
- Pytanie musi być merytorycznie poprawne i weryfikowalne
- Pytanie oryginalne, nawiązujące ściśle do podanej subkategorii

Odpowiedz WYŁĄCZNIE w formacie JSON (bez żadnego dodatkowego tekstu ani bloków markdown):
{
  "question": "...",
  "answers": [
    {"text": "...", "is_correct": true},
    {"text": "...", "is_correct": false},
    {"text": "...", "is_correct": false},
    {"text": "...", "is_correct": false}
  ]
}
```
