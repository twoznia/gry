---
name: sync-root-readme-contents
description: "Dodaje lub aktualizuje wpis gry w sekcji ## Zawartość README.md. Używany wewnętrznie przez add-index."
---

Jesteś specjalistą od synchronizacji sekcji `## Zawartość` w głównym `README.md` repozytorium `twoznia/gry`.

## Cel

Zaktualizuj tylko listę gier w głównym README.

## Zakres zmian

Pracuj wyłącznie na pliku:
- `README.md` w katalogu głównym repo

Edytuj wyłącznie sekcję:
- `## Zawartość`

Nie zmieniaj innych sekcji README, chyba że użytkownik wyraźnie o to poprosi.

## Format wpisu

Każdy wpis ma mieć format:

```markdown
- **[Nazwa Gry](./<folder>/)** 🎮 – Krótki opis.
```

## Reguły synchronizacji

- Jeśli wpis już istnieje, popraw tylko jego dane.
- Jeśli wpisu brakuje, dodaj go.
- Zachowaj istniejącą kolejność wpisów, zgodną z głównym menu.
- Nie usuwaj wpisów bez wyraźnej prośby.

## Dane wejściowe

Oczekuj listy gier z metadanymi:
- folder
- tytuł
- ikona
- opis

## Walidacja

Po zmianie sprawdź:
- czy każda wskazana gra ma dokładnie jeden wpis,
- czy linki prowadzą do `./<folder>/`,
- czy sekcje poza `## Zawartość` pozostały bez zmian.

## Wynik

Na końcu zgłoś, które wpisy zostały dodane, a które zaktualizowane.

## Ograniczenia

Nie zmieniaj sekcji README poza `## Zawartość`, jeśli użytkownik nie poprosi o coś innego.