---
name: sync-games-status-file
description: "Synchronizuje główny plik `status.md` z listą gier. Użyj tego skilla gdy chcesz zapisać wszystkie top-level gry do `status.md`, dopisać nowe gry do statusu, ujednolicić status linku back-link albo sprawdzić, czy status obejmuje wszystkie gry z katalogu głównego."
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

## Dane wejściowe

Oczekuj listy gier oraz, jeśli workflow tego wymaga, krótkiego statusu dla każdej pozycji, np.:
- `back-link: obecny`
- `back-link: dodany`
- `back-link: ujednolicony`

## Walidacja

Po zmianie sprawdź:
- czy każda top-level gra jest wpisana w `status.md`,
- czy nie ma duplikatów,
- czy nazwy folderów w statusie odpowiadają rzeczywistym folderom gry.

## Wynik

Na końcu krótko zgłoś, czy plik został utworzony czy tylko zaktualizowany.

## Ograniczenia

Nie traktuj podwidoków technicznych ani mobilnych jako osobnych gier bez wyraźnej prośby użytkownika.