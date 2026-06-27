# add_questions — instrukcja użycia

Narzędzie CLI do generowania pytań AI i dopisywania ich **bezpośrednio** do pliku
gry: `pytania/dane/pytania.csv`. To jedyne źródło prawdy, z którego korzysta gra —
nie ma już pośredniego kroku z plikami JSON ani ręcznego scalania.

---

## Wymagania

| Wymaganie | Wersja |
|-----------|--------|
| Node.js | **18 LTS lub nowszy** (wbudowany `fetch`) |
| Klucz API Anthropic | `ANTHROPIC_API_KEY` w zmiennej środowiskowej (poza `--dry-run`) |

---

## Szybki start

```bash
export ANTHROPIC_API_KEY=sk-ant-...

# Dodaj 200 pytań rozłożonych na całą bazę
node pytania/tools/add_questions.mjs --count 200
```

Skrypt rozkłada żądaną liczbę pytań na istniejące subkategorie, **zaczynając od
tych najsłabiej reprezentowanych**, więc korpus rośnie równomiernie.

---

## Parametry

| Parametr | Opis | Domyślnie |
|----------|------|-----------|
| `--count <N>` | Ile pytań dodać w tym przebiegu | `20` |
| `--category <nazwa>` | Ogranicz do jednej kategorii (np. `"Sport"`) | *(wszystkie)* |
| `--level <poziom>` | Wymuś poziom dla wszystkich nowych pytań | *(losowo wg istniejących)* |
| `--batch <N>` | Ile pytań prosić w jednym zapytaniu API | `10` |
| `--dry-run` | Pokaż plan / wynik bez zapisu | *(brak)* |
| `--help` | Wyświetl pomoc | — |

### Dozwolone poziomy (`--level`)

`łatwe` · `średnie` · `trudne` · `bardzo trudne`

---

## Zmienne środowiskowe

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `ANTHROPIC_API_KEY` | Klucz API Anthropic | *wymagana* |
| `ANTHROPIC_MODEL` | Model Claude do użycia | `claude-haiku-4-5` |

---

## Przykłady

```bash
# 200 pytań rozłożonych na wszystkie kategorie
node pytania/tools/add_questions.mjs --count 200

# 50 pytań tylko z jednej kategorii
node pytania/tools/add_questions.mjs --count 50 --category "Geografia i Turystyka"

# Podgląd planu bez zapisu (działa też bez klucza API)
node pytania/tools/add_questions.mjs --count 200 --dry-run

# Wymuszony poziom i mocniejszy model Claude (lepsza jakość, wyższy koszt)
ANTHROPIC_MODEL=claude-sonnet-4-6 node pytania/tools/add_questions.mjs --count 100 --level trudne
```

---

## Jak to działa

1. Wczytuje `pytania/dane/pytania.csv` i buduje indeks istniejących pytań.
2. Planuje, ile pytań dodać do każdej subkategorii (najpierw najsłabsze tematy).
3. Dla każdej subkategorii prosi model o partię pytań (`--batch`) jako tablicę JSON.
4. Waliduje każde pytanie:
   - pytanie ≤ 200 znaków, poprawna odpowiedź ≤ 50 znaków,
   - dokładnie 1 poprawna + 3 błędne odpowiedzi, bez powtórzeń,
   - żadne pole nie zawiera `;` ani znaku nowej linii (bezpieczeństwo CSV),
   - brak duplikatu względem **całego** pliku CSV i pytań z bieżącego przebiegu.
5. Dopisuje zaakceptowane pytania na końcu CSV.

---

## Kody wyjścia

| Kod | Znaczenie |
|-----|-----------|
| `0` | Sukces — dodano wszystkie żądane pytania |
| `1` | Nie dodano żadnego pytania |
| `2` | Częściowy sukces — dodano mniej niż `--count` |

---

## Codzienne 200 pytań (automatycznie)

Workflow `.github/workflows/pytania-daily-questions.yml` uruchamia narzędzie raz
dziennie (oraz na żądanie) i otwiera Pull Request z nowymi pytaniami do
przejrzenia. Wymaga ustawienia sekretu repozytorium **`ANTHROPIC_API_KEY`**
(Settings → Secrets and variables → Actions).

---

## Zasady generowania

Szczegółowy opis reguł i formatu promptu: [`PROMPT.md`](./PROMPT.md)
