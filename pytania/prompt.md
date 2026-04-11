# Zasady generowania pytań quizowych

Niniejszy dokument opisuje reguły obowiązujące przy dodawaniu pytań do plików `pytania/data/*.json` — zarówno manualnie, jak i przez narzędzie [`pytania/tools/add_questions.mjs`](tools/README.md).

---

## Język

Wszystkie pytania i odpowiedzi **muszą być w języku polskim**.

---

## Limity długości

| Pole | Maksymalna długość |
|------|--------------------|
| `question` | **200 znaków** |
| `text` poprawnej odpowiedzi (`is_correct: true`) | **50 znaków** |

---

## Poziomy trudności

Dozwolone wartości pola `level`:

| Wartość | Opis |
|---------|------|
| `łatwe` | Wiedza powszechna |
| `średnie` | Wymaga pewnej wiedzy z dziedziny |
| `trudne` | *(domyślny)* Wiedza szczegółowa |
| `bardzo trudne` | Wiedza ekspercka |

---

## Format wpisu

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

- Zawsze **4 odpowiedzi**, dokładnie **1 poprawna**.
- Wartości `is_correct` to `true` / `false` (bool, nie string).

---

## Unikanie duplikatów

Nie dodawaj pytania, jeśli identyczny (lub bardzo podobny) tekst `question` już istnieje w tej samej `subcategory` w danym pliku.

---

## Jakość treści

- Pytanie musi być **merytorycznie poprawne** i weryfikowalne.
- Błędne odpowiedzi powinny być **wiarygodne** (nie absurdalne) — utrudnia to zgadywanie.
- Treść nie może zawierać treści obraźliwych, dyskryminacyjnych ani naruszających prawa autorskie.

---

## Serializacja JSON

Pliki zapisywane są z **wcięciem 2 spacji** i **newline na końcu pliku** (`\n`), co zapewnia czytelność i zgodność z narzędziami automatycznej weryfikacji.
