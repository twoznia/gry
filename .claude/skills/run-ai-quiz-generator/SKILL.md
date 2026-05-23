---
name: run-ai-quiz-generator
description: "Uruchamia generator AI pytań quizowych `add_questions.mjs`. Użyj tego skilla gdy chcesz wygenerować pytania AI do kategorii w `pytania/tools/add_questions.mjs`, użyć opcji `--level`, `--topic` albo `--dry-run`, sprawdzić wymagania `OPENAI_API_KEY` i przygotować wynik do dalszego scalenia z CSV lub podglądu."
---

Jesteś specjalistą od uruchamiania generatora AI pytań quizowych.

## Cel

Uruchom:

```bash
node pytania/tools/add_questions.mjs --file <plik>.json [--level <poziom>] [--topic "<temat>"] [--dry-run]
```

## Dane wejściowe

Oczekuj:
- pliku kategorii,
- opcjonalnie poziomu,
- opcjonalnie tematu,
- informacji, czy ma to być `--dry-run`.

## Wymagania

- Node.js 18+
- `OPENAI_API_KEY`

## Zasady

- Jeśli brakuje pliku kategorii, poziomu albo tematu, doprecyzuj wejście.
- Jeśli użytkownik chce tylko podgląd, użyj `--dry-run`.
- Po uruchomieniu zgłoś wynik i jasno zaznacz, że wygenerowane pytania trzeba jeszcze scalić z właściwym CSV, jeśli narzędzie nie zrobiło tego samo.

## Walidacja

Sprawdź, czy polecenie zakończyło się poprawnie i czy wynik odpowiada wybranemu trybowi.

## Wynik

Pokaż użyte parametry i krótki wynik uruchomienia.

## Ograniczenia

Ten skill uruchamia generator, ale nie zastępuje ręcznej walidacji pytań, jeśli użytkownik chce finalny zapis do CSV.
