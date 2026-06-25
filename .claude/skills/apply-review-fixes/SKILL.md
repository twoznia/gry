---
name: apply-review-fixes
description: "Pokazuje listę proponowanych poprawek z docs/przeglad-gier.md i pozwala użytkownikowi wybrać, które zaimplementować w grach twoznia/gry. Użyj tego skilla gdy użytkownik mówi 'zaimplementuj poprawki', 'wdróż poprawki z przeglądu', 'wybierz poprawki do gier', pyta o przegląd gier, albo chce zdecydować które usprawnienia z przeglądu wprowadzić."
---

Jesteś asystentem wdrażania poprawek z przeglądu gier w repozytorium `twoznia/gry`.

Lista poprawek żyje w pliku `docs/przeglad-gier.md`. Każda poprawka ma ID (F1, F2, …),
opis, listę plików i status `[ ]` / `[x]`. Twoim zadaniem jest pokazać tę listę,
pozwolić użytkownikowi **wybrać**, które poprawki wdrożyć, a potem je zaimplementować.

## Krok 1 — Wczytaj listę

Przeczytaj `docs/przeglad-gier.md`. Jeśli plik nie istnieje, powiedz o tym i
zaproponuj najpierw wykonanie przeglądu gier (skan back-link/viewport/var/`100vh`/
zależności CDN) i zapisanie wyników do tego pliku.

## Krok 2 — Pokaż wybór

Pokaż użytkownikowi **tylko poprawki o statusie `[ ]`** (jeszcze nie zrobione), każdą
jako: `ID — krótki tytuł · nakład · liczba plików`. Zapytaj, które ma wdrożyć.

Użyj `AskUserQuestion` z opcjami wielokrotnego wyboru, gdzie każda opcja to jedna
poprawka (lub sensowna grupa). Zawsze dodaj możliwość wpisania własnej listy ID.
Nie zakładaj z góry, że użytkownik chce wszystkie — to on decyduje.

## Krok 3 — Potwierdź zakres

Dla wybranych ID streść w 1–2 zdaniach, co konkretnie zmienisz i w których plikach.
Przy poprawkach o nakładzie **L** (np. F1, F5) ostrzeż, że dotykają wielu plików i
mogą zmienić wygląd — zapytaj, czy zaczynamy od jednej gry pilotażowo, czy od razu
wszędzie.

## Krok 4 — Implementuj

Wdrażaj wybrane poprawki, jedna po drugiej:

- Zmieniaj wyłącznie to, co opisuje dana poprawka. Nie rób przy okazji innych zmian.
- Trzymaj się zasad projektu z `CLAUDE.md` (tylko `const`/`let`, back-link
  `← Wróć`, komentarze PL/EN zgodnie ze stylem pliku).
- Po edytowaniu gry, którą da się podejrzeć w przeglądarce, zweryfikuj efekt
  (np. brak błędów w konsoli, poprawny układ) zanim przejdziesz dalej.
- Dla poprawek systemowych (F1–F4) zachowaj jeden, spójny sposób zmiany we
  wszystkich plikach.

Wskazówki do typowych poprawek:
- **F4 (`100vh` → `100dvh`)**: podmień `100vh` na `100dvh`; jeśli istotne, zostaw
  `100vh` jako wcześniejszą deklarację-fallback tuż przed `100dvh`.
- **F2 / F3 (zewnętrzne zasoby)**: pobierz lokalnie tylko realnie używane zasoby,
  umieść w sensownym miejscu (`shared/…` albo folder gry) i przepnij ścieżki.
- **F1 (Tailwind CDN)**: nie usuwaj klas na siłę — zaproponuj plan (lokalny
  prebuild albo migracja do lokalnego CSS) i wdrażaj grę po grze.

## Krok 5 — Zaznacz zrobione

Po wdrożeniu każdej poprawki zmień jej status w `docs/przeglad-gier.md` z `[ ]` na
`[x]`. Jeśli poprawka została wdrożona tylko częściowo (np. w części gier), dopisz
krótką notkę, co zostało.

## Krok 6 — Podsumuj

Na końcu krótko zgłoś: które ID wdrożono, w ilu plikach, co zostało pominięte i
co ewentualnie wymaga osobnej decyzji.

## Ograniczenia

- Nie commituj ani nie twórz PR-a, jeśli użytkownik o to nie poprosi.
- Nie wdrażaj poprawek, których użytkownik nie wybrał.
- Jeśli przy implementacji okaże się, że poprawka jest ryzykowna albo szersza niż
  opis, zatrzymaj się i dopytaj zamiast zgadywać.
