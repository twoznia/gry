(() => {
    // ── Kolory (klucz → hex, niezależne od języka) ─────────────────────
    const COLORS = [
        { key: 'red',    hex: '#ef4444' },
        { key: 'blue',   hex: '#3b82f6' },
        { key: 'green',  hex: '#22c55e' },
        { key: 'yellow', hex: '#eab308' },
        { key: 'purple', hex: '#a855f7' },
        { key: 'orange', hex: '#f97316' },
    ];

    // ── Tłumaczenia ────────────────────────────────────────────────────
    const TRANSLATIONS = {
        pl: {
            title: 'Stroop',
            subtitle: 'Kliknij KOLOR czcionki, nie czytaj słowa!',
            score: 'Wynik', best: 'Rekord',
            gameOver: 'Koniec!', finalScore: (s) => `Wynik: ${s}`,
            newRecord: '🏆 NOWY REKORD!', playAgain: 'Zagraj ponownie',
            names: { red: 'CZERWONY', blue: 'NIEBIESKI', green: 'ZIELONY', yellow: 'ŻÓŁTY', purple: 'FIOLETOWY', orange: 'POMARAŃCZOWY' },
        },
        en: {
            title: 'Stroop',
            subtitle: 'Click the FONT COLOR, do not read the word!',
            score: 'Score', best: 'Best',
            gameOver: 'Game over!', finalScore: (s) => `Score: ${s}`,
            newRecord: '🏆 NEW RECORD!', playAgain: 'Play again',
            names: { red: 'RED', blue: 'BLUE', green: 'GREEN', yellow: 'YELLOW', purple: 'PURPLE', orange: 'ORANGE' },
        },
    };

    const lang = localStorage.getItem('lang') || 'pl';
    const t = TRANSLATIONS[lang];

    window.setLang = (l) => { localStorage.setItem('lang', l); location.reload(); };

    // ── Elementy ───────────────────────────────────────────────────────
    const wordEl   = document.getElementById('word');
    const scoreEl  = document.getElementById('score');
    const bestEl   = document.getElementById('best');
    const barEl    = document.getElementById('timebar-fill');
    const btnsEl   = document.getElementById('buttons');
    const overlay  = document.getElementById('overlay');
    const finalEl  = document.getElementById('final');
    const recordEl = document.getElementById('new-record');

    // ── Etykiety statyczne ─────────────────────────────────────────────
    document.getElementById('h-title').textContent = t.title;
    document.getElementById('h-subtitle').textContent = t.subtitle;
    document.getElementById('lbl-score').textContent = t.score;
    document.getElementById('lbl-best').textContent = t.best;
    document.getElementById('over-title').textContent = t.gameOver;
    document.getElementById('rec-text').textContent = t.newRecord;
    document.getElementById('btn-play').textContent = t.playAgain;
    document.getElementById('btn-pl').style.borderColor = lang === 'pl' ? '#FFD700' : '#888';
    document.getElementById('btn-en').style.borderColor = lang === 'en' ? '#FFD700' : '#888';

    // ── Stan ───────────────────────────────────────────────────────────
    const BEST_KEY = 'reflex_stroop_best';
    let best = parseInt(localStorage.getItem(BEST_KEY)) || 0;
    bestEl.textContent = best;

    let score = 0;
    let inkColor = null;      // poprawna odpowiedź (klucz koloru czcionki)
    let roundTime = 0;        // ms na rundę
    let remaining = 0;
    let timer = null;
    let palette = [];         // 4 kolory dostępne w tej rozgrywce

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function shuffle(a) { return a.slice().sort(() => Math.random() - 0.5); }

    function buildButtons() {
        palette = shuffle(COLORS).slice(0, 4);
        btnsEl.innerHTML = '';
        for (const c of palette) {
            const b = document.createElement('button');
            b.className = 'color-btn';
            b.style.background = c.hex;
            b.dataset.key = c.key;
            b.addEventListener('click', () => choose(c.key, b));
            btnsEl.appendChild(b);
        }
    }

    function nextRound() {
        const wordColor = pick(palette);   // znaczenie słowa
        const ink = pick(palette);         // kolor czcionki = poprawna odpowiedź
        inkColor = ink.key;
        wordEl.textContent = t.names[wordColor.key];
        wordEl.style.color = ink.hex;

        // czas maleje z wynikiem: od 2500 ms do min 800 ms
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
        if (key === inkColor) {
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

    function start() {
        score = 0;
        scoreEl.textContent = 0;
        overlay.classList.remove('show');
        buildButtons();
        nextRound();
    }

    document.getElementById('btn-play').addEventListener('click', start);
    start();
})();
