# Agent Skill Map

Stan na 2026-05-23.

## Common Helpers

Skille pomocnicze do ponownego użycia w wielu agentach:
- `resolve-game-folder` — wybór właściwego folderu gry
- `resolve-csv-file` — wybór właściwego pliku CSV
- `resolve-data-folder` — wybór właściwego folderu danych

## Refresh Index

Agent: `refresh-index-and-readme`

Rola: orkiestrator.

Skille używane:
- `detect-root-games`
- `extract-game-metadata`
- `sync-root-index-cards`
- `sync-root-readme-contents`
- `add-game-back-link`
- `sync-games-status-file`

## Add New Game

Agent: `add-new-game`

Rola: orkiestrator.

Skille używane:
- `resolve-game-folder` — opcjonalne rozstrzygnięcie i kontrola folderu gry
- `validate-new-game-folder`
- `collect-new-game-spec`
- `scaffold-new-game-files` — starter albo zapis zewnętrznego HTML/CSS/JS
- `add-game-back-link`
- `refresh-index-and-readme` — automatyczny sync root `index.html`, `README.md` i `status.md`
- `inspect-game-for-readme` — opcjonalnie dla README gry
- `classify-game-readme-type` — opcjonalnie dla README gry
- `compose-game-readme` — opcjonalnie dla README gry

## Add Quiz Questions

Agent: `add-quiz-questions`

Rola: orkiestrator.

Skille używane:
- `resolve-csv-file` — wybór właściwego pliku quizowego
- `quiz-csv-stats` — statystyki kategorii, poziomów i liczby pytań
- `append-quiz-questions` — dopisywanie ręcznie podanych pytań do CSV
- `validate-quiz-csv` — walidacja formatu całego pliku CSV
- `search-quiz-questions` — wyszukiwanie po kategorii, poziomie lub słowie kluczowym
- `run-ai-quiz-generator` — uruchamianie `add_questions.mjs`
- `check-quiz-duplicates` — wrapper nad `csv-duplicate-checker`

## Add Slowka Words

Agent: `add-slowka-words`

Rola: orkiestrator.

Skille używane:
- `resolve-data-folder` — wybór kategorii lub folderu danych
- `resolve-csv-file` — wybór konkretnego zestawu CSV
- `inspect-slowka-manifest` — podgląd kategorii i zestawów
- `append-slowka-words` — dopisywanie słówek do istniejącego CSV
- `create-slowka-set` — tworzenie kategorii lub nowego zestawu CSV
- `validate-slowka-csv` — walidacja pliku CSV
- `regenerate-slowka-manifest` — uruchamianie generatora manifestu
- `normalize-slowka-input` — zamiana listy lub tabeli na CSV

## Generate Game Readme

Agent: `generate-game-readme`

Rola: orkiestrator.

Skille używane:
- `resolve-game-folder` — wybór właściwego folderu gry
- `inspect-game-for-readme` — odczyt mechaniki, ekranów i sterowania z plików gry
- `classify-game-readme-type` — klasyfikacja: arcade, quiz, trener danych
- `compose-game-readme` — generowanie treści README dla gry

## CSV Duplicate Checker

Agent: `csv-duplicate-checker`

Rola: orkiestrator nad skryptami CLI.

Skille używane:
- `resolve-csv-file` — wybór właściwego pliku CSV do analizy
- `check-csv-exact-duplicates`
- `check-csv-column-duplicates`
- `check-csv-likely-duplicates`