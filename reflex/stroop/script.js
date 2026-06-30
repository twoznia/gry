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

    // ── Poziomy: 3 dziecko + 4 dorosły, czas początkowy coraz krótszy ──
    const LEVELS = [
        { mode: 'child', num: 1, base: 4000 },
        { mode: 'child', num: 2, base: 3200 },
        { mode: 'child', num: 3, base: 2600 },
        { mode: 'adult', num: 1, base: 2100 },
        { mode: 'adult', num: 2, base: 1700 },
        { mode: 'adult', num: 3, base: 1300 },
        { mode: 'adult', num: 4, base: 1000 },
    ];
    // Po HOLD ms czas startowy maleje liniowo do FLOOR w ciągu RAMP ms.
    const HOLD = 15000, RAMP = 25000, FLOOR = 300;
    const MAX_RECORDS = 5;

    const TRANSLATIONS = {
        pl: {
            title: 'Stroop', score: 'Wynik', best: 'Rekord',
            modeInk: 'Kolor czcionki', modeWord: 'Kolor słowa',
            subInk: 'Kliknij KOLOR czcionki, nie czytaj słowa!',
            subWord: 'Kliknij kolor, który NAZYWA słowo!',
            child: 'Dziecko', adult: 'Dorosły', pickLevel: 'Wybierz poziom:',
            gameOver: 'Koniec!', finalScore: (s) => `Wynik: ${s}`,
            newRecord: '🏆 NOWY REKORD!', save: 'Zapisz wynik', namePh: 'Twoje imię',
            records: '🏅 Rekordy', recordsTitle: 'Rekordy', noRecords: 'Brak wyników', back: '← Wróć', play: 'Graj',
            names: { white: 'BIAŁY', yellow: 'ŻÓŁTY', green: 'ZIELONY', blue: 'NIEBIESKI', red: 'CZERWONY', orange: 'POMARAŃCZOWY', purple: 'FIOLETOWY', black: 'CZARNY', pink: 'RÓŻOWY', brown: 'BRĄZOWY' },
            locale: 'pl-PL',
        },
        en: {
            title: 'Stroop', score: 'Score', best: 'Best',
            modeInk: 'Font color', modeWord: 'Word color',
            subInk: 'Click the FONT COLOR, do not read the word!',
            subWord: 'Click the color the WORD names!',
            child: 'Child', adult: 'Adult', pickLevel: 'Pick a level:',
            gameOver: 'Game over!', finalScore: (s) => `Score: ${s}`,
            newRecord: '🏆 NEW RECORD!', save: 'Save score', namePh: 'Your name',
            records: '🏅 Records', recordsTitle: 'Records', noRecords: 'No scores yet', back: '← Back', play: 'Play',
            names: { white: 'WHITE', yellow: 'YELLOW', green: 'GREEN', blue: 'BLUE', red: 'RED', orange: 'ORANGE', purple: 'PURPLE', black: 'BLACK', pink: 'PINK', brown: 'BROWN' },
            locale: 'en-GB',
        },
    };

    const lang = localStorage.getItem('lang') || 'pl';
    const t = TRANSLATIONS[lang];
    window.setLang = (l) => { localStorage.setItem('lang', l); location.reload(); };

    // ── Rekordy (jak inne gry reflex: obiekt JSON + imię gracza) ───────
    const RECORDS_KEY = 'reflexStroopRecords';
    const NAME_KEY    = 'reflexStroopLastName';
    function loadRecords() { try { return JSON.parse(localStorage.getItem(RECORDS_KEY)) || {}; } catch (e) { return {}; } }
    function saveRecords(r) { localStorage.setItem(RECORDS_KEY, JSON.stringify(r)); }
    let records = loadRecords();

    function levelList(mode, num) {
        return (records[mode] && records[mode][num]) || [];
    }
    function bestScore(mode, num) {
        const l = levelList(mode, num);
        return l.length ? l[0].score : 0;
    }
    function addRecord(mode, num, name, score) {
        if (!records[mode]) records[mode] = {};
        if (!records[mode][num]) records[mode][num] = [];
        records[mode][num].push({ name: name.trim() || '???', score, date: new Date().toLocaleDateString(t.locale) });
        records[mode][num].sort((a, b) => b.score - a.score);
        records[mode][num] = records[mode][num].slice(0, MAX_RECORDS);
        saveRecords(records);
    }

    // ── Elementy ───────────────────────────────────────────────────────
    const el = (id) => document.getElementById(id);
    const wordEl = el('word'), scoreEl = el('score'), bestEl = el('best');
    const barEl = el('timebar-fill'), btnsEl = el('buttons'), subtitle = el('h-subtitle');
    const menu = el('menu'), finalEl = el('final'), recordEl = el('new-record'), overTitle = el('over-title');
    const saveRow = el('save-row'), nameInput = el('player-name'), saveBtn = el('save-record');
    const btnModeInk = el('mode-ink'), btnModeWord = el('mode-word');
    const recView = el('records'), recModeTabs = el('rec-mode-tabs'), recLevelTabs = el('rec-level-tabs'), recList = el('rec-list');

    // ── Etykiety ───────────────────────────────────────────────────────
    el('h-title').textContent = t.title;
    el('lbl-score').textContent = t.score;
    el('lbl-best').textContent = t.best;
    el('lbl-pick').textContent = t.pickLevel;
    overTitle.textContent = t.gameOver;
    el('rec-text').textContent = t.newRecord;
    btnModeInk.textContent = t.modeInk;
    btnModeWord.textContent = t.modeWord;
    saveBtn.textContent = t.save;
    nameInput.placeholder = t.namePh;
    el('show-records').textContent = t.records;
    el('records-title').textContent = t.recordsTitle;
    el('rec-close').textContent = t.back;
    el('btn-pl').style.borderColor = lang === 'pl' ? '#FFD700' : '#888';
    el('btn-en').style.borderColor = lang === 'en' ? '#FFD700' : '#888';

    // ── Przyciski poziomów ─────────────────────────────────────────────
    LEVELS.forEach(lvl => {
        const b = document.createElement('button');
        b.className = 'level-btn ' + lvl.mode;
        b.innerHTML = `<span>${t[lvl.mode]} ${lvl.num}</span><small>${(lvl.base / 1000).toFixed(1)}s</small>`;
        b.addEventListener('click', () => start(lvl));
        el('levels-' + lvl.mode).appendChild(b);
    });

    // ── Stan ───────────────────────────────────────────────────────────
    let mode = 'ink';
    let level = LEVELS[3];   // domyślnie dorosły 1
    let startTime = 0, score = 0, answerKey = null, prevAnswer = null;
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

    function currentTime() {
        const elapsed = Date.now() - startTime;
        if (elapsed <= HOLD) return level.base;
        const k = Math.min(1, (elapsed - HOLD) / RAMP);
        return Math.round(level.base - (level.base - FLOOR) * k);
    }

    function nextRound() {
        let word, ink;
        if (mode === 'ink') {
            let ans = pick(BUTTON_COLORS);
            if (ans.key === prevAnswer) ans = pick(BUTTON_COLORS);
            ink = ans; word = pick(ALL.filter(c => c.key !== ink.key));
        } else {
            let ans = pick(BUTTON_COLORS);
            if (ans.key === prevAnswer) ans = pick(BUTTON_COLORS);
            word = ans; ink = pick(ALL.filter(c => c.key !== word.key));
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
            score++; scoreEl.textContent = score; nextRound();
        } else {
            btn.classList.add('flash-bad'); clearInterval(timer); gameOver();
        }
    }

    let savedThisRound = false;
    function gameOver() {
        clearInterval(timer);
        const isRecord = score > 0 && score > bestScore(level.mode, level.num);
        overTitle.style.display = 'block';
        finalEl.style.display = 'block';
        finalEl.textContent = t.finalScore(score);
        recordEl.style.display = isRecord ? 'block' : 'none';
        // wiersz zapisu wyniku (jak w innych grach reflex)
        savedThisRound = false;
        saveRow.style.display = score > 0 ? 'flex' : 'none';
        nameInput.value = localStorage.getItem(NAME_KEY) || '';
        saveBtn.disabled = false;
        menu.classList.add('show');
    }

    saveBtn.addEventListener('click', () => {
        if (savedThisRound) return;
        const name = nameInput.value.trim();
        localStorage.setItem(NAME_KEY, name);
        addRecord(level.mode, level.num, name, score);
        savedThisRound = true;
        saveBtn.disabled = true;
        bestEl.textContent = bestScore(level.mode, level.num);
        openRecords(level.mode, level.num);
    });

    function setMode(m) {
        mode = m;
        btnModeInk.classList.toggle('active', m === 'ink');
        btnModeWord.classList.toggle('active', m === 'word');
        subtitle.textContent = m === 'ink' ? t.subInk : t.subWord;
    }

    function start(lvl) {
        level = lvl;
        score = 0; prevAnswer = null;
        scoreEl.textContent = 0;
        bestEl.textContent = bestScore(lvl.mode, lvl.num);
        startTime = Date.now();
        menu.classList.remove('show');
        buildButtons();
        nextRound();
    }

    // ── Tablica rekordów ───────────────────────────────────────────────
    let viewMode = 'adult', viewNum = 1;
    function openRecords(m, n) {
        viewMode = m || viewMode; viewNum = n || viewNum;
        menu.classList.remove('show');
        recView.classList.add('show');
        renderRecords();
    }
    function renderRecords() {
        // zakładki trybu
        recModeTabs.innerHTML = '';
        for (const m of ['child', 'adult']) {
            const b = document.createElement('button');
            b.className = 'tab' + (m === viewMode ? ' active' : '');
            b.textContent = t[m];
            b.addEventListener('click', () => { viewMode = m; viewNum = 1; renderRecords(); });
            recModeTabs.appendChild(b);
        }
        // zakładki poziomów
        recLevelTabs.innerHTML = '';
        const nums = LEVELS.filter(l => l.mode === viewMode).map(l => l.num);
        for (const n of nums) {
            const b = document.createElement('button');
            b.className = 'tab' + (n === viewNum ? ' active' : '');
            b.textContent = n;
            b.addEventListener('click', () => { viewNum = n; renderRecords(); });
            recLevelTabs.appendChild(b);
        }
        // lista
        const list = levelList(viewMode, viewNum);
        if (!list.length) { recList.innerHTML = `<div class="rec-empty">${t.noRecords}</div>`; return; }
        recList.innerHTML = list.map((r, i) =>
            `<div class="rec-row"><span class="rec-rank">${i + 1}.</span><span class="rec-name">${escapeHtml(r.name)}</span><span class="rec-pts">${r.score}</span><span class="rec-date">${r.date}</span></div>`
        ).join('');
    }
    function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

    // ── Wiązania ───────────────────────────────────────────────────────
    btnModeInk.addEventListener('click', () => setMode('ink'));
    btnModeWord.addEventListener('click', () => setMode('word'));
    el('show-records').addEventListener('click', () => openRecords());
    el('rec-close').addEventListener('click', () => { recView.classList.remove('show'); showMenu(false); });

    function showMenu(afterGame) {
        overTitle.style.display = afterGame ? 'block' : 'none';
        finalEl.style.display = afterGame ? 'block' : 'none';
        if (!afterGame) { recordEl.style.display = 'none'; saveRow.style.display = 'none'; }
        menu.classList.add('show');
    }

    // ── Start ──────────────────────────────────────────────────────────
    setMode('ink');
    showMenu(false);
})();
