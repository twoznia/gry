(() => {
    const SIZES = [4, 5, 6, 7];
    const RECORDS_KEY = 'piramidyRecords';
    const PREF_KEY = 'piramidyPrefs';

    const boardEl = document.getElementById('board');
    const numpadEl = document.getElementById('numpad');
    const sizeButtonsEl = document.getElementById('sizeButtons');
    const diffButtonsEl = document.getElementById('diffButtons');
    const newGameBtn = document.getElementById('newGameBtn');
    const timerEl = document.getElementById('timer');
    const recordDisplayEl = document.getElementById('recordDisplay');
    const winBanner = document.getElementById('winBanner');
    const winText = document.getElementById('winText');
    const winPlayAgain = document.getElementById('winPlayAgain');

    // ── Ile piramid widać, patrząc na tablicę wysokości od pierwszego elementu ──
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

    // ── Losowy kwadrat łaciński n×n (wartości 1..n, bez powtórzeń w wierszu/kolumnie) ──
    function randomLatinSquare(n) {
        let grid = [];
        for (let r = 0; r < n; r++) {
            const row = [];
            for (let c = 0; c < n; c++) row.push(((c + r) % n) + 1);
            grid.push(row);
        }
        const rowOrder = shuffle([...Array(n).keys()]);
        const colOrder = shuffle([...Array(n).keys()]);
        const symbolMap = shuffle([...Array(n).keys()]).map(v => v + 1); // stara wartość i -> symbolMap[i-1]
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

    // ── Backtracking: liczy rozwiązania spełniające podane (częściowo ukryte) wskazówki ──
    // Zatrzymuje się po znalezieniu `cap` rozwiązań — używane tylko do sprawdzenia unikalności przy generowaniu.
    function countSolutions(n, clues, cap) {
        const grid = Array.from({ length: n }, () => new Array(n).fill(0));
        const rowUsed = new Array(n).fill(0);
        const colUsed = new Array(n).fill(0);
        let solutions = 0;

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
        function backtrack(r, c) {
            if (solutions >= cap) return;
            if (r === n) { if (checkCols()) solutions++; return; }
            if (c === n) { if (checkRow(r)) backtrack(r + 1, 0); return; }
            for (let v = 1; v <= n; v++) {
                const bit = 1 << (v - 1);
                if ((rowUsed[r] & bit) || (colUsed[c] & bit)) continue;
                grid[r][c] = v;
                rowUsed[r] |= bit; colUsed[c] |= bit;
                backtrack(r, c + 1);
                rowUsed[r] &= ~bit; colUsed[c] &= ~bit;
                grid[r][c] = 0;
                if (solutions >= cap) return;
            }
        }
        backtrack(0, 0);
        return solutions;
    }

    // ── Generuje łamigłówkę: losowa plansza + wskazówki, część ukryta wg trudności ──
    // Powtarza próby, aż znajdzie układ z jednym rozwiązaniem (lub wyczerpie limit prób).
    function generatePuzzle(n, difficulty) {
        const hiddenFraction = difficulty === 'hard' ? 0.5 : 0.28;
        const totalSlots = 4 * n;
        const hideCount = Math.round(totalSlots * hiddenFraction);
        let fallback = null;

        for (let attempt = 0; attempt < 60; attempt++) {
            const grid = randomLatinSquare(n);
            const full = computeClues(grid);
            const hideSet = new Set(shuffle([...Array(totalSlots).keys()]).slice(0, hideCount));
            const clues = {
                top: full.top.map((v, i) => (hideSet.has(i) ? null : v)),
                bottom: full.bottom.map((v, i) => (hideSet.has(n + i) ? null : v)),
                left: full.left.map((v, i) => (hideSet.has(2 * n + i) ? null : v)),
                right: full.right.map((v, i) => (hideSet.has(3 * n + i) ? null : v)),
            };
            if (countSolutions(n, clues, 2) === 1) return clues;
            fallback = clues;
        }
        return fallback; // rzadki przypadek: brak unikalnego układu w limicie prób
    }

    // ── Stan gry ──────────────────────────────────────────────────────────────
    let n = 5;
    let difficulty = 'easy';
    let clues = null;
    let values = [];          // values[r][c] = 0 (puste) lub 1..n
    let selected = null;      // {r, c} lub null
    let timerInterval = null;
    let elapsedSec = 0;
    let solved = false;

    function loadPrefs() {
        try {
            const p = JSON.parse(localStorage.getItem(PREF_KEY)) || {};
            if (SIZES.includes(p.n)) n = p.n;
            if (p.difficulty === 'easy' || p.difficulty === 'hard') difficulty = p.difficulty;
        } catch (e) { /* domyślne wartości */ }
    }
    function savePrefs() {
        localStorage.setItem(PREF_KEY, JSON.stringify({ n, difficulty }));
    }

    function loadRecords() {
        try { return JSON.parse(localStorage.getItem(RECORDS_KEY)) || {}; } catch (e) { return {}; }
    }
    function recordKey() { return `${n}-${difficulty}`; }
    function bestTime() {
        const r = loadRecords()[recordKey()];
        return typeof r === 'number' ? r : null;
    }
    function saveRecordIfBest(sec) {
        const records = loadRecords();
        const key = recordKey();
        if (records[key] == null || sec < records[key]) {
            records[key] = sec;
            localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
            return true;
        }
        return false;
    }
    function formatTime(sec) {
        const m = Math.floor(sec / 60), s = sec % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }
    function updateRecordDisplay() {
        const b = bestTime();
        recordDisplayEl.textContent = b == null ? '—' : formatTime(b);
    }

    function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
    function startTimer() {
        stopTimer();
        elapsedSec = 0;
        timerEl.textContent = formatTime(0);
        timerInterval = setInterval(() => {
            elapsedSec++;
            timerEl.textContent = formatTime(elapsedSec);
        }, 1000);
    }

    // ── Budowa przycisków rozmiaru planszy ───────────────────────────────────
    SIZES.forEach(size => {
        const b = document.createElement('button');
        b.className = 'pill';
        b.textContent = `${size}×${size}`;
        b.dataset.size = size;
        b.addEventListener('click', () => { n = size; savePrefs(); newGame(); });
        sizeButtonsEl.appendChild(b);
    });
    function syncSizeButtons() {
        [...sizeButtonsEl.children].forEach(b => b.classList.toggle('active', Number(b.dataset.size) === n));
    }
    diffButtonsEl.querySelectorAll('.pill').forEach(b => {
        b.addEventListener('click', () => { difficulty = b.dataset.diff; savePrefs(); newGame(); });
    });
    function syncDiffButtons() {
        diffButtonsEl.querySelectorAll('.pill').forEach(b => b.classList.toggle('active', b.dataset.diff === difficulty));
    }

    // ── Renderowanie planszy (n+2)×(n+2): brzeg wskazówek + środek do gry ─────
    function render() {
        boardEl.style.setProperty('--n', n);
        boardEl.style.setProperty('--cell-font', `${Math.max(14, 30 - n * 2)}px`);
        boardEl.style.setProperty('--clue-font', `${Math.max(12, 22 - n * 1.5)}px`);
        boardEl.innerHTML = '';

        for (let R = 0; R < n + 2; R++) {
            for (let C = 0; C < n + 2; C++) {
                const isCornerRow = R === 0 || R === n + 1;
                const isCornerCol = C === 0 || C === n + 1;
                if (isCornerRow && isCornerCol) {
                    const div = document.createElement('div');
                    div.className = 'cell corner';
                    boardEl.appendChild(div);
                    continue;
                }
                if (isCornerRow) {
                    const c = C - 1;
                    const div = document.createElement('div');
                    div.className = 'cell clue';
                    const val = R === 0 ? clues.top[c] : clues.bottom[c];
                    div.textContent = val == null ? '' : val;
                    div.dataset.role = R === 0 ? 'top' : 'bottom';
                    div.dataset.index = c;
                    boardEl.appendChild(div);
                    continue;
                }
                if (isCornerCol) {
                    const r = R - 1;
                    const div = document.createElement('div');
                    div.className = 'cell clue';
                    const val = C === 0 ? clues.left[r] : clues.right[r];
                    div.textContent = val == null ? '' : val;
                    div.dataset.role = C === 0 ? 'left' : 'right';
                    div.dataset.index = r;
                    boardEl.appendChild(div);
                    continue;
                }
                const r = R - 1, c = C - 1;
                const btn = document.createElement('button');
                btn.className = 'cell play';
                btn.type = 'button';
                btn.dataset.r = r;
                btn.dataset.c = c;
                btn.addEventListener('click', () => selectCell(r, c));
                boardEl.appendChild(btn);
            }
        }
        renderNumpad();
    }

    function renderNumpad() {
        numpadEl.innerHTML = '';
        for (let v = 1; v <= n; v++) {
            const b = document.createElement('button');
            b.className = 'num-btn';
            b.textContent = v;
            b.addEventListener('click', () => inputValue(v));
            numpadEl.appendChild(b);
        }
        const clearBtn = document.createElement('button');
        clearBtn.className = 'num-btn clear-btn';
        clearBtn.textContent = '×';
        clearBtn.addEventListener('click', () => inputValue(0));
        numpadEl.appendChild(clearBtn);
    }

    function playCellEl(r, c) {
        return boardEl.querySelector(`.play[data-r="${r}"][data-c="${c}"]`);
    }

    function selectCell(r, c) {
        if (solved) return;
        selected = { r, c };
        boardEl.querySelectorAll('.play.selected').forEach(el => el.classList.remove('selected'));
        playCellEl(r, c).classList.add('selected');
    }

    function inputValue(v) {
        if (!selected || solved) return;
        const { r, c } = selected;
        values[r][c] = values[r][c] === v ? 0 : v;   // ponowne kliknięcie tej samej liczby czyści pole
        const el = playCellEl(r, c);
        el.textContent = values[r][c] === 0 ? '' : values[r][c];
        updateConflicts();
        updateClueFeedback();
        checkWin();
    }

    // ── Podświetlenie powtórzonych liczb w wierszu/kolumnie ──────────────────
    function groupByValue(getValue, length) {
        const groups = new Map();
        for (let i = 0; i < length; i++) {
            const v = getValue(i);
            if (!v) continue;
            if (!groups.has(v)) groups.set(v, []);
            groups.get(v).push(i);
        }
        return groups;
    }
    function updateConflicts() {
        boardEl.querySelectorAll('.play.conflict').forEach(el => el.classList.remove('conflict'));
        for (let r = 0; r < n; r++) {
            for (const cols of groupByValue(c => values[r][c], n).values()) {
                if (cols.length > 1) cols.forEach(c => playCellEl(r, c).classList.add('conflict'));
            }
        }
        for (let c = 0; c < n; c++) {
            for (const rows of groupByValue(r => values[r][c], n).values()) {
                if (rows.length > 1) rows.forEach(r => playCellEl(r, c).classList.add('conflict'));
            }
        }
    }

    // ── Oznaczenie wskazówek jako spełnione/niespełnione (gdy wiersz/kolumna kompletne) ──
    function clueCellEl(role, index) {
        return boardEl.querySelector(`.clue[data-role="${role}"][data-index="${index}"]`);
    }
    function updateClueFeedback() {
        boardEl.querySelectorAll('.clue').forEach(el => el.classList.remove('clue-ok', 'clue-bad'));
        for (let r = 0; r < n; r++) {
            const row = values[r];
            if (row.includes(0)) continue;
            if (clues.left[r] != null) mark(clueCellEl('left', r), countVisible(row) === clues.left[r]);
            if (clues.right[r] != null) mark(clueCellEl('right', r), countVisible(row.slice().reverse()) === clues.right[r]);
        }
        for (let c = 0; c < n; c++) {
            const col = values.map(row => row[c]);
            if (col.includes(0)) continue;
            if (clues.top[c] != null) mark(clueCellEl('top', c), countVisible(col) === clues.top[c]);
            if (clues.bottom[c] != null) mark(clueCellEl('bottom', c), countVisible(col.slice().reverse()) === clues.bottom[c]);
        }
    }
    function mark(el, ok) { el.classList.add(ok ? 'clue-ok' : 'clue-bad'); }

    function checkWin() {
        if (values.some(row => row.includes(0))) return;
        const validLatin = boardEl.querySelectorAll('.play.conflict').length === 0;
        const cluesOk = [...boardEl.querySelectorAll('.clue')].filter(el => el.textContent !== '')
            .every(el => el.classList.contains('clue-ok'));
        if (!validLatin || !cluesOk) return;

        solved = true;
        stopTimer();
        const isRecord = saveRecordIfBest(elapsedSec);
        updateRecordDisplay();
        winText.textContent = isRecord
            ? `🏆 Nowy rekord! Czas: ${formatTime(elapsedSec)}`
            : `Rozwiązane! Czas: ${formatTime(elapsedSec)}`;
        winBanner.hidden = false;
    }

    // ── Klawiatura: cyfry ustawiają wartość, strzałki przesuwają zaznaczenie ──
    document.addEventListener('keydown', (e) => {
        if (!selected) return;
        if (e.key >= '1' && e.key <= '9') {
            const v = Number(e.key);
            if (v <= n) { inputValue(v); e.preventDefault(); }
            return;
        }
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            if (values[selected.r][selected.c] !== 0) inputValue(values[selected.r][selected.c]);
            e.preventDefault();
            return;
        }
        const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (moves[e.key]) {
            const [dr, dc] = moves[e.key];
            const r = Math.min(n - 1, Math.max(0, selected.r + dr));
            const c = Math.min(n - 1, Math.max(0, selected.c + dc));
            selectCell(r, c);
            e.preventDefault();
        }
    });

    function newGame() {
        winBanner.hidden = true;
        solved = false;
        selected = null;
        syncSizeButtons();
        syncDiffButtons();
        clues = generatePuzzle(n, difficulty);
        values = Array.from({ length: n }, () => new Array(n).fill(0));
        render();
        updateRecordDisplay();
        startTimer();
    }

    newGameBtn.addEventListener('click', newGame);
    winPlayAgain.addEventListener('click', newGame);

    loadPrefs();
    newGame();
})();
