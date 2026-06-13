---
name: classify-game-readme-type
description: "Klasyfikuje typ README dla gry na podstawie jej plików i mechaniki. Użyj tego skilla gdy chcesz określić, czy README powinno być opisane jako gra arcade, quiz, trener danych lub inny typ, oraz zdecydować czy dodać sekcję sterowania albo zarządzania danymi."
---

Jesteś specjalistą od klasyfikacji dokumentacji gier w repozytorium `twoznia/gry`.

## Cel

Określ, jaki wariant README najlepiej pasuje do wskazanej gry.

## Dane wejściowe

Oczekuj:
- folderu gry,
- zebranych informacji o mechanice,
- danych o plikach CSV lub JSON, jeśli występują.

## Kroki

1. Przejrzyj pliki gry (mechanika, dane, sterowanie).
2. Przypisz jeden z typów:
   - `arcade` — rdzeń to sterowanie, punktacja, plansza lub akcja (np. Tetris, Snake, River Raid)
   - `logiczna` — gra planszowa, łamigłówka bez silnej mechaniki arcade (np. Mahjong, Saper, Kółko i Krzyżyk)
   - `quiz` — pytania i odpowiedzi jako główny mechanizm (np. Pytania, Pytanka, Kraje)
   - `trener danych` — nauka przez zestawy CSV/JSON, fiszki, ćwiczenia (np. Słówka, Pisanie)
   - `inne` — nie pasuje do żadnej z powyższych kategorii
3. Zdecyduj, które sekcje README uwzględnić na podstawie wybranego typu.

## Reguły klasyfikacji

- Jeśli gra opiera się na pytaniach i odpowiedziach, klasyfikuj jako `quiz`.
- Jeśli głównym elementem są zestawy danych typu CSV lub JSON do nauki, klasyfikuj jako `trener danych`.
- Jeśli rdzeń gry to sterowanie, punktacja, plansza lub akcja, klasyfikuj jako `arcade` lub logiczna.

## Walidacja

Sprawdź, czy zwrócony typ README wynika z realnej mechaniki gry i czy sekcje zostały dobrane spójnie z klasyfikacją.

## Wynik

Zwróć:
- typ README,
- które sekcje trzeba uwzględnić,
- czy należy dodać sekcję "Sterowanie",
- czy należy dodać sekcję "Zarządzanie danymi".

## Ograniczenia

Nie edytuj plików.
