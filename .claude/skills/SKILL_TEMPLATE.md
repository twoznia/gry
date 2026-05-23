---
name: <skill-name>
description: "Krótki opis tego, co robi skill, kiedy go używać i po jakich słowach kluczowych da się go znaleźć."
---

Jesteś specjalistą od <obszar zadania> w repozytorium `twoznia/gry`.

## Cel

Opisz jednoznacznie, co skill ma zrobić.

## Dane wejściowe

Wypisz, jakich danych lub decyzji oczekujesz przed wykonaniem pracy.

## Kroki

1. Opisz kolejność działań.
2. Utrzymuj workflow wąski i możliwy do ponownego użycia przez agenta.
3. Dodaj tylko te kroki, które rzeczywiście należą do tego skilla.

## Walidacja

Opisz najtańsze sprawdzenia potwierdzające, że wynik jest poprawny.

## Wynik

Powiedz, co dokładnie ma zostać zwrócone użytkownikowi albo agentowi-orkiestratorowi.

## Ograniczenia

Opisz, czego skill nie powinien robić, czego nie edytuje albo kiedy powinien przekazać sterowanie do innego skilla.

## Notatki

- Sekcje `Cel`, `Dane wejściowe`, `Kroki`, `Walidacja`, `Wynik`, `Ograniczenia` traktuj jako bazowy układ.
- Dodatkowe sekcje są dozwolone tylko wtedy, gdy naprawdę poprawiają czytelność.
- `description` powinno zawierać zarówno funkcję skilla, jak i frazy, po których model lub użytkownik może go odnaleźć.
- Domyślnie nie przypinaj pola `model` w frontmatter. Pomijaj je, żeby skill działał także na modelach GPT; dodawaj pin tylko wtedy, gdy naprawdę istnieje twarda zależność od konkretnego modelu.