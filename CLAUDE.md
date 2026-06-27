# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Collection of simple browser games by [@twoznia](https://github.com/twoznia). Pure HTML/CSS/JS — no frameworks, no bundler, no backend. Each game runs directly in a browser and lives in its own top-level folder.

## Architecture

```
/
├── index.html          # Main menu — lists all game cards
├── shared/style.css    # Shared dark-theme design system
├── <game-folder>/
│   ├── index.html      # Required
│   ├── style.css       # Optional
│   └── script.js       # Optional
├── pytania/            # Adult quiz — data in pytania/dane/pytania.csv
├── pytanka/            # Kids quiz — data in pytanka/dane/pytania.csv
└── słówka/             # Vocabulary trainer — data in słówka/data/, manifest in słówka/data/manifest.json
```

Games are fully self-contained — they do not depend on each other. Shared code lives only in `shared/`.

## Coding rules

- `const`/`let` only, never `var`
- Comments in Polish or English — match the existing file's style
- New games must include: `<a class="back-link" href="../">← Wróć</a>` directly inside `<body>`
- New games may use the shared design system: `<link rel="stylesheet" href="../shared/style.css">`

## Design system (`shared/style.css`)

Key CSS variables: `--bg` (#0f172a), `--card` (#1e293b), `--border` (#334155), `--text` (#f8fafc), `--muted` (#94a3b8), `--accent` (#38bdf8), `--green` (#22c55e), `--red` (#ef4444), `--yellow` (#f59e0b).

Ready-made classes: `.screen`/`.screen.active`, `.card`, `.btn.btn-primary`, `.btn.btn-secondary`, `.hud`, `.progress-bar`, `.progress-dot`, `a.back-link`.

## Data-driven games

### Pytania (`pytania/dane/pytania.csv`)
Format (no header, semicolon separator, UTF-8):
```
category;subcategory;level;question;correct;wrong1;wrong2;wrong3
```
Levels: `łatwe` · `średnie` · `trudne` · `bardzo trudne`

### Pytanka (`pytanka/dane/pytania.csv`)
Same format but only 3 wrong answers (`wrong1;wrong2`, no `wrong3`).

### Słówka (`słówka/data/`)
- CSV files in `słówka/data/<Category>/<set>.csv`, format: `polskie słowo,angielskie słowo` (comma separator, no header)
- `słówka/data/manifest.json` is auto-generated — **never edit it manually**
- Regenerate after data changes: `node słówka/tools/generate_manifest.mjs` (Node.js 18+)
- Also updated automatically by GitHub Actions on push to `słówka/data/**`

## Node.js tools

```bash
# AI quiz question generator (requires OPENAI_API_KEY, Node.js 18+)
# Writes directly to pytania/dane/pytania.csv — no manual merge needed.
node pytania/tools/add_questions.mjs --count 200
node pytania/tools/add_questions.mjs --count 50 --category "Sport"
node pytania/tools/add_questions.mjs --count 200 --dry-run

# Regenerate słówka manifest
node słówka/tools/generate_manifest.mjs
```

`add_questions.mjs` generates AI questions and appends them straight to `pytania/dane/pytania.csv` (the file the game loads). It spreads `--count` across the least-represented subcategories, deduplicates against the whole CSV, and validates length/format/CSV-safety. A daily GitHub Action (`.github/workflows/pytania-daily-questions.yml`) can run it automatically and open a PR — it needs the `OPENAI_API_KEY` repo secret.

## Adding a new game

1. Create `<game-folder>/index.html` (and optionally `style.css`, `script.js`)
2. Add `<a class="back-link" href="../">← Wróć</a>` inside `<body>`
3. Update `index.html`, `README.md`, and `status.md` in the repo root to include the new game
