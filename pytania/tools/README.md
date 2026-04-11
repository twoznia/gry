# add_questions — instrukcja użycia

Narzędzie CLI do dodawania pytań generowanych przez AI do plików `pytania/data/*.json`.

---

## Wymagania

| Wymaganie | Wersja |
|-----------|--------|
| Node.js | 18 lub nowszy (wbudowany `fetch`) |
| Klucz API OpenAI | `OPENAI_API_KEY` w zmiennej środowiskowej |

---

## Szybki start

```bash
# 1. Ustaw klucz API OpenAI
export OPENAI_API_KEY=sk-...

# 2. Uruchom narzędzie
node pytania/tools/add_questions.mjs --file muzyka.json
```

Skrypt automatycznie znajdzie wszystkie unikalne `subcategory` w pliku i doda **1 nowe pytanie dla każdej subkategorii**.

---

## Parametry

| Parametr | Opis | Domyślnie |
|----------|------|-----------|
| `--file <name>` | Nazwa pliku w `pytania/data` (np. `muzyka.json`) | *wymagany* |
| `--level <value>` | Poziom trudności (patrz tabela poniżej) | `trudne` |
| `--topic <text>` | Dodatkowy kontekst/temat dla generatora | *(brak)* |
| `--dry-run` | Wyświetl zmiany bez zapisywania pliku | *(brak)* |
| `--help` | Wyświetl pomoc | — |

### Dozwolone poziomy (`--level`)

`łatwe` · `średnie` · `trudne` · `bardzo trudne`

---

## Zmienne środowiskowe

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `OPENAI_API_KEY` | Klucz API OpenAI | *wymagana* |
| `OPENAI_MODEL` | Model do użycia | `gpt-4o-mini` |

---

## Przykłady

### Podstawowe wywołanie

```bash
node pytania/tools/add_questions.mjs --file muzyka.json
```

### Z poziomem i tematem

```bash
node pytania/tools/add_questions.mjs \
  --file muzyka.json \
  --level trudne \
  --topic "muzyka klasyczna, Chopin"
```

### Podgląd bez zapisu (dry-run)

```bash
node pytania/tools/add_questions.mjs \
  --file historia.json \
  --level łatwe \
  --dry-run
```

### Inny model OpenAI

```bash
OPENAI_MODEL=gpt-4o node pytania/tools/add_questions.mjs --file sport.json --level trudne
```

---

## Dostępne pliki kategorii

| Plik | Kategoria |
|------|-----------|
| `film_i_telewizja.json` | Film i Telewizja |
| `geografia_i_turystyka.json` | Geografia i Turystyka |
| `historia.json` | Historia |
| `kulinaria_i_smaki.json` | Kulinaria i Smaki |
| `literatura_i_jezyk.json` | Literatura i Język |
| `motoryzacja_i_transport.json` | Motoryzacja i Transport |
| `muzyka.json` | Muzyka |
| `nauka_i_odkrycia.json` | Nauka i Odkrycia |
| `przyroda_i_biologia.json` | Przyroda i Biologia |
| `rozrywka_i_popkultura.json` | Rozrywka i Popkultura |
| `spoleczenstwo_i_prawo.json` | Społeczeństwo i Prawo |
| `sport.json` | Sport |
| `sztuka_i_architektura.json` | Sztuka i Architektura |
| `technologie_i_it.json` | Technologie i IT |
| `tradycje_i_religie.json` | Tradycje i Religie |
| `wiedza_ogolna_i_ciekawostki.json` | Wiedza Ogólna i Ciekawostki |

> ⚠️ `manifest.json` jest plikiem systemowym i **nie można go edytować** tym narzędziem.

---

## Działanie narzędzia

1. Wczytuje wskazany plik JSON.
2. Odnajduje wszystkie unikalne `subcategory` w tablicy `questions`.
3. Dla każdej subkategorii wysyła zapytanie do OpenAI API, prosząc o 1 pytanie.
4. Waliduje odpowiedź:
   - pytanie ≤ 200 znaków,
   - poprawna odpowiedź ≤ 50 znaków,
   - dokładnie 4 odpowiedzi, 1 poprawna,
   - brak duplikatu w tej samej subkategorii.
5. Dopisuje nowe pytania do pliku (zachowując formatowanie: 2 spacje, newline na końcu).

---

## Kody wyjścia

| Kod | Znaczenie |
|-----|-----------|
| `0` | Sukces |
| `1` | Błąd krytyczny lub wszystkie pytania nie wygenerowane |
| `2` | Częściowy sukces — część pytań nie wygenerowana |

---

## Zasady generowania

Szczegółowy opis reguł i formatu promptu: [`PROMPT.md`](./PROMPT.md)
