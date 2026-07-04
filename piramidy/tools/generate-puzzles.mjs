// Generuje bank łamigłówek Piramidy (Skyscraper Puzzle) offline i zapisuje do piramidy/data/puzzles.json.
//
// Użycie:
//   node piramidy/tools/generate-puzzles.mjs [liczbaNaKombinacje]
//
// Domyślnie generuje 25 łamigłówek dla każdej kombinacji rozmiaru (4/5/6/7) i trudności (easy/hard).
// Każda łamigłówka jest zapisana jako zwarty kod tekstowy (podobnie jak kod udostępniania w Sudoku),
// który da się szybko zdekodować w przeglądarce bez ponownego liczenia unikalności rozwiązania.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '..', 'data', 'puzzles.json');

const SIZES = [4, 5, 6, 7];
const DIFFICULTIES = ['easy', 'hard'];
const PER_BUCKET = Number(process.argv[2]) || 25;

// ── Te same funkcje co w piramidy/script.js (patrz tam po komentarze do algorytmu) ──

function countVisible(arr) {
    let maxSoFar = 0, count = 0;
    for (const v of arr) { if (v > maxSoFar) { count++; maxSoFar = v; } }
    return count;
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function randomLatinSquare(n) {
    let grid = [];
    for (let r = 0; r < n; r++) {
        const row = [];
        for (let c = 0; c < n; c++) row.push(((c + r) % n) + 1);
        grid.push(row);
    }
    const rowOrder = shuffle([...Array(n).keys()]);
    const colOrder = shuffle([...Array(n).keys()]);
    const symbolMap = shuffle([...Array(n).keys()]).map(v => v + 1);
    grid = rowOrder.map(r => colOrder.map(c => symbolMap[grid[r][c] - 1]));
    return grid;
}

function computeClues(grid) {
    const n = grid.length;
    const left = [], right = [], top = [], bottom = [];
    for (let r = 0; r < n; r++) {
        const row = grid[r];
        left.push(countVisible(row));
        right.push(countVisible(row.slice().reverse()));
    }
    for (let c = 0; c < n; c++) {
        const col = grid.map(row => row[c]);
        top.push(countVisible(col));
        bottom.push(countVisible(col.slice().reverse()));
    }
    return { top, bottom, left, right };
}

// Backtracking z przycinaniem NA BIEŻĄCO, przy każdej wstawianej liczbie (nie dopiero
// po ukończeniu wiersza/planszy) — licznik widocznych „od lewej” (wskazówka left) i
// „od góry” (wskazówka top) tylko rośnie w miarę wypełniania planszy, więc przekroczenie
// celu w dowolnym momencie = ślepa gałąź, którą można od razu odciąć. Bez tego (sprawdzanie
// dopiero na końcu wiersza/planszy, jak w script.js) dla plansz 6×6/7×7 przeszukiwanie
// eksploduje — nawet przy PEŁNYM komplecie wskazówek potrafi trwać dziesiątki sekund.
// Wskazówki "right"/"bottom" nadal sprawdzane są dopiero po ukończeniu wiersza/planszy
// (wymagają znajomości całego wiersza/kolumny), ale to już wystarcza do rozsądnej szybkości.
//
// Dowodzenie UNIKALNOŚCI (solutions === 1) bywa dla 7×7 wyjątkowo kosztowne — trzeba
// przeszukać niemal całą przestrzeń, żeby wykluczyć drugie rozwiązanie. `nodeBudget`
// ogranicza to w czasie: po przekroczeniu limitu zwracamy -1 (nierozstrzygnięte), a
// wywołujący traktuje to zachowawczo — "nie ryzykuj, zostaw wskazówkę odkrytą" — więc
// wynik zawsze pozostaje poprawny (nigdy fałszywie "unikalny"), tylko czasem mniej
// wskazówek uda się ukryć niż w idealnym przypadku.
function countSolutions(n, clues, cap, nodeBudget = Infinity) {
    const grid = Array.from({ length: n }, () => new Array(n).fill(0));
    const rowUsed = new Array(n).fill(0);
    const colUsed = new Array(n).fill(0);
    const colMax = new Array(n).fill(0);
    const colVis = new Array(n).fill(0);
    let solutions = 0;
    let nodes = 0;
    let budgetExceeded = false;

    function checkRow(r) {
        const row = grid[r];
        if (clues.left[r] != null && countVisible(row) !== clues.left[r]) return false;
        if (clues.right[r] != null && countVisible(row.slice().reverse()) !== clues.right[r]) return false;
        return true;
    }
    function checkCols() {
        for (let c = 0; c < n; c++) {
            const col = grid.map(row => row[c]);
            if (clues.top[c] != null && countVisible(col) !== clues.top[c]) return false;
            if (clues.bottom[c] != null && countVisible(col.slice().reverse()) !== clues.bottom[c]) return false;
        }
        return true;
    }
    function backtrack(r, c, rowMax, rowVis) {
        if (solutions >= cap || budgetExceeded) return;
        if (++nodes > nodeBudget) { budgetExceeded = true; return; }
        if (r === n) { if (checkCols()) solutions++; return; }
        if (c === n) { if (checkRow(r)) backtrack(r + 1, 0, 0, 0); return; }
        for (let v = 1; v <= n; v++) {
            const bit = 1 << (v - 1);
            if ((rowUsed[r] & bit) || (colUsed[c] & bit)) continue;

            const newRowVis = v > rowMax ? rowVis + 1 : rowVis;
            if (clues.left[r] != null && newRowVis > clues.left[r]) continue;
            const newColVis = v > colMax[c] ? colVis[c] + 1 : colVis[c];
            if (clues.top[c] != null && newColVis > clues.top[c]) continue;

            grid[r][c] = v;
            rowUsed[r] |= bit; colUsed[c] |= bit;
            const prevColMax = colMax[c], prevColVis = colVis[c];
            colMax[c] = Math.max(colMax[c], v);
            colVis[c] = newColVis;

            backtrack(r, c + 1, Math.max(rowMax, v), newRowVis);

            colMax[c] = prevColMax; colVis[c] = prevColVis;
            rowUsed[r] &= ~bit; colUsed[c] &= ~bit;
            grid[r][c] = 0;
            if (solutions >= cap || budgetExceeded) return;
        }
    }
    backtrack(0, 0, 0, 0);
    return budgetExceeded ? -1 : solutions;
}

// Startujemy od PEŁNEGO kompletu wskazówek i po kolei, w losowej kolejności, próbujemy
// ukryć każdą wskazówkę — zostawiamy ją ukrytą tylko jeśli po usunięciu układ nadal ma
// dokładnie jedno rozwiązanie. To standardowa technika "kucia dziur" (hole digging).
//
// Niektóre losowe plansze 6×6/7×7 mają PEŁNY komplet wskazówek, który sam w sobie nie
// wyznacza rozwiązania jednoznacznie (rzadka, ale realna właściwość tej łamigłówki dla
// większych n) — usuwanie wskazówek nigdy nie może wtedy się udać (usunięcie informacji
// nie może zmniejszyć liczby rozwiązań), więc `hidden` zostanie równe 0. To wystarczający
// sygnał, by odrzucić tę planszę i wylosować nową — bez dodatkowego, osobnego sprawdzenia.
// Górny limit węzłów przeszukiwania na jedno sprawdzenie unikalności — ok. 1s dla 7×7
// w najgorszym przypadku (dowodzenie unikalności). Bez tego pojedyncze sprawdzenie
// potrafi się ciągnąć wiele minut (patrz komentarz przy countSolutions).
const NODE_BUDGET = 12_000_000;
const MAX_GRID_ATTEMPTS = 12;

function generatePuzzle(n, difficulty) {
    const hiddenFraction = difficulty === 'hard' ? 0.5 : 0.28;
    const totalSlots = 4 * n;
    const targetHide = Math.round(totalSlots * hiddenFraction);

    for (let gridAttempt = 0; ; gridAttempt++) {
        const grid = randomLatinSquare(n);
        const full = computeClues(grid);
        const clues = {
            top: full.top.slice(),
            bottom: full.bottom.slice(),
            left: full.left.slice(),
            right: full.right.slice(),
        };

        // Kolejność ma znaczenie: "left"/"top" korzystają z przycinania na bieżąco
        // w countSolutions, więc ich ukrycie utrudnia WSZYSTKIE kolejne sprawdzenia dla
        // tej planszy. Próbujemy więc najpierw ukryć "right"/"bottom" (nic nie tracimy),
        // a "left"/"top" zostawiamy na koniec — to znacznie podnosiło skuteczność w testach.
        const slots = [
            ...shuffle(Array.from({ length: n }, (_, i) => ['right', i])),
            ...shuffle(Array.from({ length: n }, (_, i) => ['bottom', i])),
            ...shuffle(Array.from({ length: n }, (_, i) => ['left', i])),
            ...shuffle(Array.from({ length: n }, (_, i) => ['top', i])),
        ];

        let hidden = 0;
        for (const [key, idx] of slots) {
            if (hidden >= targetHide) break;
            const backup = clues[key][idx];
            clues[key][idx] = null;
            // -1 (nierozstrzygnięte w limicie węzłów) traktujemy tak samo jak "niejednoznaczne" —
            // zachowawczo zostawiamy wskazówkę odkrytą zamiast ryzykować błędną łamigłówkę.
            if (countSolutions(n, clues, 2, NODE_BUDGET) === 1) {
                hidden++;
            } else {
                clues[key][idx] = backup;
            }
        }

        if (hidden === 0 && gridAttempt < MAX_GRID_ATTEMPTS - 1) continue; // pełny komplet wskazówek nie był unikalny (lub zbyt trudny do zweryfikowania) — spróbuj innej planszy
        return { clues, solution: grid, hiddenCount: hidden, targetHide, gridAttempts: gridAttempt + 1 };
    }
}

// ── Zwarty kod tekstowy: <n><diff><clues 4×n, '0'=ukryta><solution n×n> ──
// Analogicznie do kodu udostępniania w Sudoku (encodePuzzle/loadFromCode w sudoku/script.js).

function encodePuzzle(n, difficulty, clues, solution) {
    const diffCode = difficulty === 'hard' ? 'h' : 'e';
    const clueDigits = [...clues.top, ...clues.bottom, ...clues.left, ...clues.right]
        .map(v => (v == null ? '0' : String(v)))
        .join('');
    const solutionDigits = solution.flat().join('');
    return `${n}${diffCode}${clueDigits}${solutionDigits}`;
}

function decodePuzzle(code) {
    const n = Number(code[0]);
    const difficulty = code[1] === 'h' ? 'hard' : 'easy';
    const clueDigits = code.slice(2, 2 + 4 * n);
    const solutionDigits = code.slice(2 + 4 * n, 2 + 4 * n + n * n);
    const nums = str => str.split('').map(Number);
    const clueVals = nums(clueDigits).map(v => (v === 0 ? null : v));
    const clues = {
        top: clueVals.slice(0, n),
        bottom: clueVals.slice(n, 2 * n),
        left: clueVals.slice(2 * n, 3 * n),
        right: clueVals.slice(3 * n, 4 * n),
    };
    const solutionFlat = nums(solutionDigits);
    const solution = [];
    for (let r = 0; r < n; r++) solution.push(solutionFlat.slice(r * n, r * n + n));
    return { n, difficulty, clues, solution };
}

function assertRoundTrip(n, difficulty, clues, solution, code) {
    const decoded = decodePuzzle(code);
    const same = JSON.stringify({ clues, solution }) === JSON.stringify({ clues: decoded.clues, solution: decoded.solution });
    if (!same || decoded.n !== n || decoded.difficulty !== difficulty) {
        throw new Error(`Błąd kodowania/dekodowania dla kodu: ${code}`);
    }
}

// ── Generowanie banku ──────────────────────────────────────────────────────

const bank = {};

for (const n of SIZES) {
    for (const difficulty of DIFFICULTIES) {
        const key = `${n}-${difficulty}`;
        const codes = [];
        let shortOfTarget = 0;
        let retriedGrids = 0;
        let trivialCount = 0;
        const start = Date.now();

        for (let i = 0; i < PER_BUCKET; i++) {
            const { clues, solution, hiddenCount, targetHide, gridAttempts } = generatePuzzle(n, difficulty);
            if (hiddenCount < targetHide) shortOfTarget++;
            if (hiddenCount === 0) trivialCount++;
            if (gridAttempts > 1) retriedGrids++;
            const code = encodePuzzle(n, difficulty, clues, solution);
            assertRoundTrip(n, difficulty, clues, solution, code);
            codes.push(code);
        }

        bank[key] = codes;
        const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);
        const notes = [];
        if (shortOfTarget > 0) notes.push(`${shortOfTarget}× mniej ukrytych wskazówek niż docelowo`);
        if (retriedGrids > 0) notes.push(`${retriedGrids}× trzeba było odrzucić planszę (brak unikalności)`);
        console.log(`${key}: ${codes.length} łamigłówek w ${elapsedSec}s${notes.length ? '  (' + notes.join(', ') + ')' : ''}`);
        // Trywialna łamigłówka (0 ukrytych wskazówek = od razu rozwiązana plansza) — rzadkie,
        // ale możliwe dla 7×7 przy pechowej serii plansz. Uruchom skrypt ponownie dla tego
        // rozmiaru/trudności, jeśli chcesz to naprawić (za każdym razem losowana jest inna plansza).
        if (trivialCount > 0) console.log(`  ⚠ ${trivialCount}× TRYWIALNA łamigłówka (0 ukrytych wskazówek) — rozważ ponowne uruchomienie`);

        // Zapis po każdej kombinacji, nie dopiero na końcu — 7×7 potrafi się długo generować,
        // więc przerwanie skryptu w trakcie nie traci już ukończonych kombinacji.
        writeFileSync(outputPath, JSON.stringify(bank, null, 2) + '\n', 'utf-8');
    }
}

console.log(`\nZapisano: ${outputPath}`);
