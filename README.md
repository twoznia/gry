# gry

Zbiór prostych gier przeglądarkowych stworzonych przez Tomka ([@twoznia](https://github.com/twoznia)).

## Zawartość

- **[Wyścigi Aut](./auta/)** 🏎️ – Gra wyścigowa, w której omijasz przeszkody i jedziesz jak najszybciej.
- **[River Raid](./riverraid/)** ✈️ – Arcadowy lot bojowy nad rzeką z paliwem, mostami i wrogami.
- **[Mat-Jaja](./mat-jaja/)** 🥚 – Matematyczna zabawa z jajkami w roli głównej.
- **[Rybak](./rybak/)** 🚣 – Spokojna gra wędkarska na jeziorze.
- **[Pisanie](./pisanie/)** 🖊️ – Nauka pisania polskich słów, literka po literce.
- **[Słówka](./słówka/)** 🇬🇧 – Trener słówek do nauki polskiego i angielskiego.
- **[Kraje](./kraje/)** 🌍 – Sprawdź swoją wiedzę o krajach, stolicach i flagach.
- **[Memo](./memo/)** 🃏 – Znajdź wszystkie pary ukrytych obrazków.
- **[Puzzle](./puzzle/)** 🧩 – Składaj obrazki z puzzli, kawałek po kawałku.
- **[Pytania](./pytania/)** 🧠 – Quiz wiedzy ogólnej – historia, nauka, kultura i wiele więcej.
- **[Pytanka](./pytanka/)** 🐣 – Quiz dla dzieci z 3 odpowiedziami do wyboru.

---

## Słówka

Gra `Słówka` korzysta z manifestu `słówka/data/manifest.json`, który opisuje dostępne kategorie i zestawy CSV.

- źródłem danych pozostają katalogi i pliki CSV w `słówka/data/`,
- manifest jest plikiem pochodnym używanym przez grę,
- manifest aktualizuje skrypt `słówka/tools/generate_manifest.mjs`,
- przy zmianach w danych `Słówka` manifest odświeża workflow `.github/workflows/update-slowka-manifest.yml`.

---



## Dodawanie pytań do quizu

Pytania są przechowywane w pliku CSV:

```
pytania/dane/pytania.csv
```

Format wiersza: `category;subcategory;level;question;correct;wrong1;wrong2;wrong3`

Dostępne poziomy trudności: `łatwe`, `średnie`, `trudne`, `bardzo trudne`.

---

## Dodawanie nowej gry

1. Utwórz folder o nazwie gry (np. `moja-gra/`) z plikiem `index.html`.
2. Dodaj link powrotny do menu głównego: `<a href="../">← Menu</a>`.
3. W pliku `index.html` (główny) dodaj kartę gry do sekcji `<main class="game-container">`.
4. Zaktualizuj listę gier w tym `README.md`.

Gry używające ciemnego motywu (@twoznia design system) mogą dołączyć wspólny arkusz stylów:

```html
<link rel="stylesheet" href="../shared/style.css">
```
