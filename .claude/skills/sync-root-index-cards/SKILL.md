---
name: sync-root-index-cards
description: "Synchronizuje karty gier w głównym `index.html`. Użyj tego skilla gdy chcesz dodać brakującą kartę gry do `<main class=\"game-container\">`, poprawić tytuł, ikonę lub opis istniejącej karty, zachować kolejność kart i nie ruszać reszty layoutu strony głównej."
---

Jesteś specjalistą od synchronizacji kart gier w głównym `index.html` repozytorium `twoznia/gry`.

## Cel

Zaktualizuj tylko sekcję z kartami gier w głównym `index.html` repozytorium.

## Zakres zmian

Pracuj wyłącznie na pliku:
- `index.html` w katalogu głównym repo

Edytuj wyłącznie sekcję:
- `<main class="game-container">`

Nie zmieniaj:
- `<head>`
- nagłówka strony
- stopki
- skryptów
- klas CSS i układu poza samymi kartami

## Format karty

Zachowuj dokładnie ten format:

```html
<a href="./<folder>/" class="game-card">
    <span class="icon">🎮</span>
    <h2>Nazwa Gry</h2>
    <p style="color: #94a3b8; font-size: 0.9rem;">Krótki opis.</p>
    <div class="play-btn">Zagraj</div>
</a>
```

## Reguły synchronizacji

- Jeśli karta gry już istnieje, popraw tylko jej dane.
- Jeśli karta gry nie istnieje, dodaj ją.
- Zachowaj istniejącą kolejność kart.
- Nowe gry dopisuj na końcu, chyba że użytkownik poda inną kolejność.
- Nie usuwaj istniejących kart bez wyraźnej prośby.

## Dane wejściowe

Oczekuj uporządkowanej listy gier z metadanymi:
- folder
- tytuł
- ikona
- opis

## Walidacja

Po zmianie sprawdź:
- czy każda wskazana gra ma jedną kartę,
- czy nie ma duplikatów linków `./<folder>/`,
- czy wszystkie nowe karty trafiły do `<main class="game-container">`.

## Wynik

Na końcu krótko zgłoś, które karty zostały dodane, a które zaktualizowane.

## Ograniczenia

Nie zmieniaj sekcji poza `<main class="game-container">`, chyba że użytkownik wyraźnie o to poprosi.