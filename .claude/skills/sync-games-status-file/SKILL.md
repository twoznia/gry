---
name: sync-games-status-file
description: "Aktualizuje status.md po dodaniu gry. Używany wewnętrznie przez add-index."
---

Jesteś specjalistą od utrzymywania pliku `status.md` w repozytorium `twoznia/gry`.

## Cel

Zsynchronizuj plik `status.md` z aktualną listą gier z katalogu głównego.

## Zakres zmian

Pracuj wyłącznie na:
- `status.md` w katalogu głównym repo

## Reguły

- Uwzględniaj tylko top-level gry z własnym `index.html`.
- Nie traktuj podkatalogów technicznych ani mobilnych wariantów jako osobnych gier, chyba że użytkownik wyraźnie o to poprosi.
- Jeśli format `status.md` już istnieje, zachowaj go.
- Jeśli plik nie istnieje, utwórz go w prostym, czytelnym formacie markdown.

## Format pliku status.md

```markdown
# Status Gier

Stan na RRRR-MM-DD.

- <folder-gry> - back-link: <obecny|dodany|ujednolicony>
- <folder-gry> - back-link: <obecny|dodany|ujednolicony>
```

Przykład:
```markdown
# Status Gier

Stan na 2026-06-13.

- auta - back-link: ujednolicony
- jumper - back-link: ujednolicony
- kulki - back-link: dodany
- pytania - back-link: obecny
```

## Dane wejściowe

Oczekuj listy gier oraz, jeśli workflow tego wymaga, krótkiego statusu dla każdej pozycji:
- `back-link: obecny` — link istniał wcześniej w poprawnej formie
- `back-link: dodany` — link został dodany przez `add-game-back-link`
- `back-link: ujednolicony` — link istniał, ale został ujednolicony do standardowego formatu

## Walidacja

Po zmianie sprawdź:
- czy każda top-level gra jest wpisana w `status.md`,
- czy nie ma duplikatów,
- czy nazwy folderów w statusie odpowiadają rzeczywistym folderom gry.

## Wynik

Na końcu krótko zgłoś, czy plik został utworzony czy tylko zaktualizowany.

## Ograniczenia

Nie traktuj podwidoków technicznych ani mobilnych jako osobnych gier bez wyraźnej prośby użytkownika.