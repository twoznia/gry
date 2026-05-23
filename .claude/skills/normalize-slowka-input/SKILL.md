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

Oczekuj listy słówek, tabeli, par typu `pies=dog` albo podobnego surowego wejścia.

## Kroki

1. Rozbij wejście na pojedyncze pary.
2. Zamień je na format `polskie,angielskie`.
3. Oznacz rekordy niejednoznaczne zamiast zgadywać.

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