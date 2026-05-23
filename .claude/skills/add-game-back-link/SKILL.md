---
name: add-game-back-link
description: "Dodaje standardowy link powrotny <a class=\"back-link\" href=\"../\">← Wróć</a> do nowej gry albo ujednolica istniejący link w grze. Użyj tego skilla gdy tworzysz nową grę, dodajesz plik index.html gry, chcesz wstawić back-link po tagu <body>, albo zamienić stare warianty typu ← Menu na wspólny format projektu."
---

Jesteś specjalistą od ujednolicania linków powrotu w repozytorium `twoznia/gry`.

Twoim zadaniem jest dopilnowanie, aby każda nowa gra miała standardowy link:

```html
<a class="back-link" href="../">← Wróć</a>
```

## Cel

Dodaj albo ujednolić standardowy link powrotny w grze.

## Dane wejściowe

Jeśli użytkownik nie podał folderu gry, zapytaj o:
- nazwę folderu gry, np. `kulki`, `moja-gra`, `quiz-muzyczny`.

## Kroki

### 1. Znajdź plik gry

Pracuj na pliku:

```text
<folder>/index.html
```

Zakładaj, że chodzi o grę z katalogu głównego repozytorium, a nie o podwidoki typu `rybak/mobile/`, chyba że użytkownik poprosi inaczej.

### 2. Wstaw lub ujednolić link

Docelowy znacznik to zawsze:

```html
<a class="back-link" href="../">← Wróć</a>
```

Zasady:
- jeśli dokładnie taki znacznik już istnieje, niczego nie duplikuj,
- jeśli istnieje starszy link typu `← Menu`, `id="back-btn"`, `class="back-link"` z innym tekstem lub link ze stylami inline, zamień go na standardowy znacznik,
- jeśli linku nie ma, wstaw go bezpośrednio po otwarciu `<body>`.

### 3. Zapewnij styl `.back-link`

Dobierz najbezpieczniejszą metodę dla danej gry:
- jeśli gra ładuje `../shared/style.css`, nie dodawaj dodatkowego stylu, bo `a.back-link` już tam istnieje,
- jeśli gra ma lokalny styl `.back-link`, użyj go,
- jeśli gra nie ma żadnego stylu `.back-link`, dodaj minimalny lokalny CSS tylko dla tego elementu.

Minimalny styl awaryjny:

```css
.back-link {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 100;
    background: #334155;
    color: #fff;
    border: 1px solid #475569;
    border-radius: 8px;
    padding: 8px 14px;
    text-decoration: none;
    font-size: 13px;
}

.back-link:hover { background: #475569; }
```

Preferencje edycji:
- jeśli gra ma własny blok `<style>` w `index.html`, dodaj styl tam,
- jeśli gra używa lokalnego `style.css` i ma już podobne style przycisku powrotu, dostosuj istniejący selektor do `a.back-link` zamiast dublować reguły,
- nie dołączaj `../shared/style.css` tylko po to, żeby obsłużyć sam back-link, jeśli mogłoby to zmienić layout gry.

## Walidacja

Po zmianie sprawdź:
- czy w `index.html` gry istnieje dokładnie jeden znacznik:
  ```html
  <a class="back-link" href="../">← Wróć</a>
  ```
- czy w tym samym pliku nie został stary wariant `← Menu`,
- czy po zmianie plik nie ma błędów składniowych.

## Ograniczenia

- Nie zmieniaj mechaniki gry.
- Nie ruszaj katalogów pomocniczych ani mobilnych wariantów gry, jeśli użytkownik o to nie poprosi.
- Nie duplikuj linku powrotu.
- Zachowuj istniejący styl gry, ingeruj tylko tyle, ile potrzeba do obsługi `back-link`.

## Wynik dla użytkownika

Na końcu podaj krótko:
- która gra została zmieniona,
- czy link został dodany czy ujednolicony,
- gdzie został dodany styl `.back-link`, jeśli był potrzebny.
