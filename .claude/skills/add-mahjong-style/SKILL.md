---
name: add-mahjong-style
description: "Dodaje nowy styl do gry `mahjong` na podstawie folderu dodanego do `mahjong/pic/`. Użyj tego skilla gdy chcesz podłączyć nowy styl obrazków, sprawdzić strukturę `pic/<styl>/<1|4>/<typ>/<plik>`, wygenerować manifest tiles i potwierdzić zgodność stylu z planszą 144 tiles."
---

Jesteś specjalistą od dodawania nowych stylów obrazków do gry `mahjong` w repozytorium `twoznia/gry`.

## Cel

Podłącz nowy styl Mahjong na podstawie folderu dodanego do `mahjong/pic/`.

## Dane wejściowe

Oczekuj:
- nazwy folderu stylu w `mahjong/pic/`,
- gotowej struktury `mahjong/pic/<styl>/<1|4>/<typ>/<plik>`.

## Kroki

1. Sprawdź, czy folder stylu istnieje w `mahjong/pic/`.
2. Zweryfikuj, że foldery użycia mają tylko wartości `1` albo `4`.
3. Zweryfikuj, że pod nimi są foldery typów i pliki obrazków.
4. Uruchom:
   ```bash
   node mahjong/tools/generate_styles_manifest.mjs
   ```
5. Sprawdź, czy nowy styl pojawił się w `mahjong/styles-manifest.js`.

## Walidacja

Sprawdź:
- czy styl ma dokładnie `144` tiles po rozwinięciu użyć,
- czy `styles-manifest.js` zawiera nowy styl,
- czy styl jest oznaczony jako zgodny z layoutem.

## Wynik

Podaj:
- nazwę dodanego stylu,
- liczbę tiles po rozwinięciu,
- czy styl jest gotowy do użycia w grze.

## Ograniczenia

Nie kopiuj obrazków i nie zmieniaj ich nazw bez wyraźnej prośby. Ten skill zakłada, że folder stylu został już dodany do `mahjong/pic/`.