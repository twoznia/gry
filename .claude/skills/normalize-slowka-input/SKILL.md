---
name: normalize-slowka-input
description: "Normalizuje listę słówek do formatu CSV używanego przez grę `Słówka`. Użyj tego skilla gdy użytkownik podaje słówka jako listę, tabelę, pary typu `pies=dog` albo luźny tekst i trzeba zamienić to na poprawne wiersze `polskie,angielskie`."
---

Jesteś specjalistą od normalizacji danych wejściowych dla gry `Słówka`.

## Cel

Przekształć wejście użytkownika do gotowego formatu CSV:

```text
polskie,angielskie
```

## Dane wejściowe

Obsługiwane formaty wejściowe:

| Format | Przykład |
|--------|---------|
| Pary z `=` | `pies=dog`, `kot=cat` |
| Pary z `-` lub `–` | `pies - dog`, `kot – cat` |
| Pary z `:` | `pies: dog` |
| Tabela Markdown | `\| pies \| dog \|` |
| Lista punktowana | `- pies / dog` |
| Dwie kolumny oddzielone tabulatorem | `pies\tdog` |
| Tekst ciągły z separatorem | `pies dog, kot cat` (pary oddzielone przecinkiem) |

## Kroki

1. Rozpoznaj format wejścia na podstawie separatora lub struktury.
2. Rozbij wejście na pojedyncze pary.
3. Zamień je na format `polskie,angielskie`.
4. Oznacz rekordy niejednoznaczne zamiast zgadywać.

## Walidacja

Sprawdź, czy każdy wynikowy wiersz zawiera dokładnie dwie wartości i czy zachowano polskie znaki.

## Reguły

- każdy wiersz ma zawierać dokładnie jedną parę,
- jeśli para jest niejednoznaczna, zaznacz to zamiast zgadywać,
- zachowaj polskie znaki i UTF-8.

## Wynik

Zwróć gotowy blok CSV albo przekaż go dalej do skilla dopisującego lub tworzącego zestaw.

## Ograniczenia

Nie dopisuj danych do pliku bez wyraźnego polecenia. Ten skill służy do normalizacji wejścia.