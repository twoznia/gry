(() => {
    // ── Przyciski odpowiedzi: 6 stałych kolorów ────────────────────────
    const BUTTON_COLORS = [
        { key: 'white',  hex: '#ffffff' },
        { key: 'yellow', hex: '#facc15' },
        { key: 'green',  hex: '#22c55e' },
        { key: 'blue',   hex: '#3b82f6' },
        { key: 'red',    hex: '#ef4444' },
        { key: 'orange', hex: '#f97316' },
    ];
    // ── Dodatkowe kolory tylko jako dystraktory (nigdy odpowiedź) ───────
    const EXTRA_COLORS = [
        { key: 'purple', hex: '#a855f7' },
        { key: 'black',  hex: '#0a0a0a' },
        { key: 'pink',   hex: '#ec4899' },
        { key: 'brown',  hex: '#92400e' },
    ];
    const ALL = [...BUTTON_COLORS, ...EXTRA_COLORS];

    const TRANSLATIONS = {
        pl: {
            title: 'Stroop', score: 'Wynik', best: 'Rekord',
            modeInk: 'Kolor czcionki', modeWord: 'Kolor słowa',
            subInk: 'Kliknij KOLOR czcionki, nie czytaj słowa!',
            subWord: 'Kliknij kolor, który NAZYWA słowo!',
            gameOver: 'Koniec!', finalScore: (s) => `Wynik: ${s}`,
            newRecord: '🏆 NOWY REKORD!', playAgain: 'Zagraj ponownie',
            names: { white: 'BIAŁY', yellow: 'ŻÓŁTY', green: 'ZIELONY', blue: 'NIEBIESKI', red: 'CZERWONY', orange: 'POMARAŃCZOWY', purple: 'FIOLETOWY', black: 'CZARNY', pink: 'RÓŻOWY', brown: 'BRĄZOWY' },
        },
        en: {
            title: 'Stroop', score: 'Score', best: 'Best',
            modeInk: 'Font color', modeWord: 'Word color',
            subInk: 'Click the FONT COLOR, do not read the word!',
            subWord: 'Click the color the WORD names!',
            gameOver: 'Game over!', finalScore: (s) => `Score: ${s}`,
            newRecord: '🏆 NEW RECORD!', playAgain: 'Play again',
            names: { white: 'WHITE', yellow: 'YELLOW', green: 'GREEN', blue: 'BLUE', red: 'RED', orange: 'ORANGE', purple: 'PURPLE', black: 'BLACK', pink: 'PINK', brown: 'BROWN' },
        },
    };

    const lang = localStorage.getItem('lang') || 'pl';
    const t = TRANSLATIONS[lang];
    window.setLang = (l) => { localStorage.setItem('lang', l); location.reload(); };

    // ── Elementy ───────────────────────────────────────────────────────
    const wordEl    = document.getElementById('word');
    const scoreEl   = document.getElementById('score');
    const bestEl    = document.getElementById('best');
    const barEl     = document.getElementById('timebar-fill');
    const btnsEl    = document.getElementById('buttons');
    const subtitle  = document.getElementById('h-subtitle');
    const overlay   = document.getElementById('overlay');
    const finalEl   = document.getElementById('final');
    const recordEl  = document.getElementById('new-record');
    const btnModeInk  = document.getElementById('mode-ink');
    const btnModeWord = document.getElementById('mode-word');

    // ── Etykiety ───────────────────────────────────────────────────────
    document.getElementById('h-title').textContent = t.title;
    document.getElementById('lbl-score').textContent = t.score;
    document.getElementById('lbl-best').textContent = t.best;
    document.getElementById('over-title').textContent = t.gameOver;
    document.getElementById('rec-text').textContent = t.newRecord;
    document.getElementById('btn-play').textContent = t.playAgain;
    btnModeInk.textContent = t.modeInk;
    btnModeWord.textContent = t.modeWord;
    document.getElementById('btn-pl').style.borderColor = lang === 'pl' ? '#FFD700' : '#888';
    document.getElementById('btn-en').style.borderColor = lang === 'en' ? '#FFD700' : '#888';

    // ── Stan ───────────────────────────────────────────────────────────
    const BEST_KEY = 'reflex_stroop_best';
    let best = parseInt(localStorage.getItem(BEST_KEY)) || 0;
    bestEl.textContent = best;

    let mode = 'ink';     // 'ink' = klikasz kolor czcionki, 'word' = kolor nazwany słowem
    let score = 0;
    let answerKey = null;
    let prevAnswer = null;
    let roundTime = 0, remaining = 0, timer = null;

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function shuffle(a) { return a.slice().sort(() => Math.random() - 0.5); }
    const byKey = (k) => ALL.find(c => c.key === k);

    function buildButtons() {
        btnsEl.innerHTML = '';
        for (const c of shuffle(BUTTON_COLORS)) {
            const b = document.createElement('button');
            b.className = 'color-btn';
            b.style.background = c.hex;
            b.dataset.key = c.key;
            b.addEventListener('click', () => choose(c.key, b));
            btnsEl.appendChild(b);
        }
    }

    function nextRound() {
        let word, ink;
        if (mode === 'ink') {
            // odpowiedź = kolor czcionki (musi być wśród przycisków)
            let ans = pick(BUTTON_COLORS);
            if (ans.key === prevAnswer) ans = pick(BUTTON_COLORS);
            ink = ans;
            word = pick(ALL.filter(c => c.key !== ink.key));   // słowo ≠ czcionka
        } else {
            // odpowiedź = kolor nazwany słowem (musi być wśród przycisków)
            let ans = pick(BUTTON_COLORS);
            if (ans.key === prevAnswer) ans = pick(BUTTON_COLORS);
            word = ans;
            ink = pick(ALL.filter(c => c.key !== word.key));   // czcionka ≠ słowo
        }
        answerKey = (mode === 'ink' ? ink : word).key;
        prevAnswer = answerKey;

        wordEl.textContent = t.names[word.key];
        wordEl.style.color = ink.hex;

        roundTime = Math.max(800, 2500 - score * 70);
        remaining = roundTime;
        clearInterval(timer);
        timer = setInterval(tick, 50);
        updateBar();
    }

    function tick() {
        remaining -= 50;
        updateBar();
        if (remaining <= 0) { clearInterval(timer); gameOver(); }
    }

    function updateBar() {
        barEl.style.width = Math.max(0, (remaining / roundTime) * 100) + '%';
        barEl.style.background = remaining < roundTime * 0.3 ? '#ef4444' : '#22c55e';
    }

    function choose(key, btn) {
        if (key === answerKey) {
            score++;
            scoreEl.textContent = score;
            nextRound();
        } else {
            btn.classList.add('flash-bad');
            clearInterval(timer);
            gameOver();
        }
    }

    function gameOver() {
        clearInterval(timer);
        const isRecord = score > best;
        if (isRecord) { best = score; localStorage.setItem(BEST_KEY, best); bestEl.textContent = best; }
        recordEl.style.display = isRecord ? 'block' : 'none';
        finalEl.textContent = t.finalScore(score);
        overlay.classList.add('show');
    }

    function setMode(m) {
        mode = m;
        btnModeInk.classList.toggle('active', m === 'ink');
        btnModeWord.classList.toggle('active', m === 'word');
        subtitle.textContent = m === 'ink' ? t.subInk : t.subWord;
        start();
    }

    function start() {
        score = 0; prevAnswer = null;
        scoreEl.textContent = 0;
        overlay.classList.remove('show');
        buildButtons();
        nextRound();
    }

    btnModeInk.addEventListener('click', () => setMode('ink'));
    btnModeWord.addEventListener('click', () => setMode('word'));
    document.getElementById('btn-play').addEventListener('click', start);

    setMode('ink');
})();
