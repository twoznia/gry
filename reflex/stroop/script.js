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

    // ── Poziomy: czas początkowy (ms) na kliknięcie. Wyższy = krótszy ──
    const LEVELS = [
        { id: 'k1', group: 'child', base: 4000 },
        { id: 'k2', group: 'child', base: 3200 },
        { id: 'k3', group: 'child', base: 2600 },
        { id: 'd1', group: 'adult', base: 2100 },
        { id: 'd2', group: 'adult', base: 1700 },
        { id: 'd3', group: 'adult', base: 1300 },
        { id: 'd4', group: 'adult', base: 1000 },
    ];
    // Po HOLD ms czas zaczyna maleć liniowo do FLOOR w ciągu RAMP ms.
    const HOLD = 15000, RAMP = 25000, FLOOR = 300;

    const TRANSLATIONS = {
        pl: {
            title: 'Stroop', score: 'Wynik', best: 'Rekord',
            modeInk: 'Kolor czcionki', modeWord: 'Kolor słowa',
            subInk: 'Kliknij KOLOR czcionki, nie czytaj słowa!',
            subWord: 'Kliknij kolor, który NAZYWA słowo!',
            child: 'Dziecko', adult: 'Dorosły', pickLevel: 'Wybierz poziom:',
            gameOver: 'Koniec!', finalScore: (s) => `Wynik: ${s}`,
            newRecord: '🏆 NOWY REKORD!',
            names: { white: 'BIAŁY', yellow: 'ŻÓŁTY', green: 'ZIELONY', blue: 'NIEBIESKI', red: 'CZERWONY', orange: 'POMARAŃCZOWY', purple: 'FIOLETOWY', black: 'CZARNY', pink: 'RÓŻOWY', brown: 'BRĄZOWY' },
        },
        en: {
            title: 'Stroop', score: 'Score', best: 'Best',
            modeInk: 'Font color', modeWord: 'Word color',
            subInk: 'Click the FONT COLOR, do not read the word!',
            subWord: 'Click the color the WORD names!',
            child: 'Child', adult: 'Adult', pickLevel: 'Pick a level:',
            gameOver: 'Game over!', finalScore: (s) => `Score: ${s}`,
            newRecord: '🏆 NEW RECORD!',
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
    const menu      = document.getElementById('menu');
    const finalEl   = document.getElementById('final');
    const recordEl  = document.getElementById('new-record');
    const overTitle = document.getElementById('over-title');
    const btnModeInk  = document.getElementById('mode-ink');
    const btnModeWord = document.getElementById('mode-word');

    // ── Etykiety statyczne ─────────────────────────────────────────────
    document.getElementById('h-title').textContent = t.title;
    document.getElementById('lbl-score').textContent = t.score;
    document.getElementById('lbl-best').textContent = t.best;
    document.getElementById('lbl-pick').textContent = t.pickLevel;
    overTitle.textContent = t.gameOver;
    document.getElementById('rec-text').textContent = t.newRecord;
    btnModeInk.textContent = t.modeInk;
    btnModeWord.textContent = t.modeWord;
    document.getElementById('btn-pl').style.borderColor = lang === 'pl' ? '#FFD700' : '#888';
    document.getElementById('btn-en').style.borderColor = lang === 'en' ? '#FFD700' : '#888';

    // ── Przyciski poziomów ─────────────────────────────────────────────
    const rowChild = document.getElementById('levels-child');
    const rowAdult = document.getElementById('levels-adult');
    LEVELS.forEach(lvl => {
        const n = lvl.group === 'child'
            ? LEVELS.filter(l => l.group === 'child').indexOf(lvl) + 1
            : LEVELS.filter(l => l.group === 'adult').indexOf(lvl) + 1;
        const b = document.createElement('button');
        b.className = 'level-btn ' + lvl.group;
        b.innerHTML = `<span>${t[lvl.group]} ${n}</span><small>${(lvl.base / 1000).toFixed(1)}s</small>`;
        b.addEventListener('click', () => start(lvl.base));
        (lvl.group === 'child' ? rowChild : rowAdult).appendChild(b);
    });

    // ── Stan ───────────────────────────────────────────────────────────
    const BEST_KEY = 'reflex_stroop_best';
    let best = parseInt(localStorage.getItem(BEST_KEY)) || 0;
    bestEl.textContent = best;

    let mode = 'ink';
    let baseTime = 2100;
    let startTime = 0;
    let score = 0, answerKey = null, prevAnswer = null;
    let roundTime = 0, remaining = 0, timer = null;

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);

    function buildButtons() {
        btnsEl.innerHTML = '';
        for (const c of shuffle(BUTTON_COLORS)) {
            const b = document.createElement('button');
            b.className = 'color-btn';
            b.style.background = c.hex;
            b.addEventListener('click', () => choose(c.key, b));
            btnsEl.appendChild(b);
        }
    }

    // Czas rundy: stały przez HOLD ms, potem liniowo maleje do FLOOR.
    function currentTime() {
        const elapsed = Date.now() - startTime;
        if (elapsed <= HOLD) return baseTime;
        const k = Math.min(1, (elapsed - HOLD) / RAMP);
        return Math.round(baseTime - (baseTime - FLOOR) * k);
    }

    function nextRound() {
        let word, ink;
        if (mode === 'ink') {
            let ans = pick(BUTTON_COLORS);
            if (ans.key === prevAnswer) ans = pick(BUTTON_COLORS);
            ink = ans;
            word = pick(ALL.filter(c => c.key !== ink.key));
        } else {
            let ans = pick(BUTTON_COLORS);
            if (ans.key === prevAnswer) ans = pick(BUTTON_COLORS);
            word = ans;
            ink = pick(ALL.filter(c => c.key !== word.key));
        }
        answerKey = (mode === 'ink' ? ink : word).key;
        prevAnswer = answerKey;

        wordEl.textContent = t.names[word.key];
        wordEl.style.color = ink.hex;

        roundTime = currentTime();
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
        overTitle.style.display = 'block';
        finalEl.style.display = 'block';
        finalEl.textContent = t.finalScore(score);
        recordEl.style.display = isRecord ? 'block' : 'none';
        menu.classList.add('show');
    }

    function setMode(m) {
        mode = m;
        btnModeInk.classList.toggle('active', m === 'ink');
        btnModeWord.classList.toggle('active', m === 'word');
        subtitle.textContent = m === 'ink' ? t.subInk : t.subWord;
    }

    function start(base) {
        baseTime = base;
        score = 0; prevAnswer = null;
        scoreEl.textContent = 0;
        startTime = Date.now();
        menu.classList.remove('show');
        buildButtons();
        nextRound();
    }

    btnModeInk.addEventListener('click', () => setMode('ink'));
    btnModeWord.addEventListener('click', () => setMode('word'));

    // Ekran startowy: bez wyniku, tylko wybór trybu i poziomu.
    setMode('ink');
    overTitle.style.display = 'none';
    finalEl.style.display = 'none';
    recordEl.style.display = 'none';
    menu.classList.add('show');
})();
