// ── Data loading ─────────────────────────────────────────────────────────────
let allData = [];      // [{category, icon, questions:[{subcategory,question,answers}]}]
let loadError = false;

const CATEGORY_ICONS = {
    'Film i Telewizja':            '🎬',
    'Geografia i Turystyka':       '🗺️',
    'Historia':                    '📜',
    'Kulinaria i Smaki':           '🍽️',
    'Literatura i Język':          '📚',
    'Matura Geografia':            '🌍',
    'Matura Język Polski':         '🖋️',
    'Motoryzacja i Transport':     '🚗',
    'Muzyka':                      '🎵',
    'Nauka i Odkrycia':            '🔬',
    'Przyroda i Biologia':         '🌿',
    'Rozrywka i Popkultura':       '🎭',
    'Sport':                       '⚽',
    'Społeczeństwo i Prawo':       '⚖️',
    'Sztuka i Architektura':       '🎨',
    'Technologie i IT':            '💻',
    'Tradycje i Religie':          '⛪',
    'Wiedza Ogólna i Ciekawostki': '🧠',
};

async function loadAllData() {
    try {
        const text = await fetch('./dane/pytania.csv').then(r => r.text());
        const lines = text.split('\n');
        const categoryMap = new Map(); // category -> {category, icon, questions:[]}
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const cols = line.split(';');
            if (cols.length < 8) continue;
            const [category, subcategory, level, question, correct, wrong1, wrong2, wrong3] = cols;
            if (!category || !question || !correct) continue;
            if (!categoryMap.has(category)) {
                categoryMap.set(category, {
                    category,
                    icon: CATEGORY_ICONS[category] || '❓',
                    questions: [],
                });
            }
            categoryMap.get(category).questions.push({
                subcategory,
                level,
                question,
                answers: shuffle([
                    { text: correct, is_correct: true },
                    { text: wrong1,  is_correct: false },
                    { text: wrong2,  is_correct: false },
                    { text: wrong3,  is_correct: false },
                ]),
            });
        }
        allData = Array.from(categoryMap.values());
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-start').textContent = 'Rozpocznij Quiz →';
        populateCategorySelect();
    } catch (e) {
        loadError = true;
        document.getElementById('setup-error').textContent = 'Błąd ładowania danych.';
    }
}

function populateCategorySelect() {
    const sel = document.getElementById('sel-category');
    allData.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.category;
        opt.textContent = (d.icon || '❓') + ' ' + d.category;
        sel.appendChild(opt);
    });
    populateLevelSelect();
}

function populateLevelSelect() {
    const sel = document.getElementById('sel-level');
    const levels = [...new Set(allData.flatMap(d => d.questions.map(q => q.level)).filter(Boolean))].sort();
    levels.forEach(level => {
        const opt = document.createElement('option');
        opt.value = level;
        opt.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        sel.appendChild(opt);
    });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getRandomCategoryQuestions(numQ, levelFilter) {
    const categoryPools = shuffle(allData.map(d => ({
        category: d.category,
        questions: shuffle(
            d.questions
                .filter(q => !levelFilter || levelFilter === '__all__' || q.level === levelFilter)
                .map(q => ({ ...q, _category: d.category }))
        ),
    }))).filter(d => d.questions.length > 0);

    const selected = [];

    while (selected.length < numQ) {
        const availablePools = categoryPools.filter(d => d.questions.length > 0);
        if (!availablePools.length) break;

        availablePools.forEach(pool => {
            if (selected.length >= numQ || !pool.questions.length) return;
            selected.push(pool.questions.pop());
        });
    }

    return selected;
}

function getQuestions(categoryName, numQ, levelFilter) {
    let pool;
    if (categoryName === '__random__') {
        return getRandomCategoryQuestions(numQ, levelFilter);
    } else {
        const catData = allData.find(d => d.category === categoryName);
        if (!catData) return [];
        pool = catData.questions.map(q => ({ ...q, _category: catData.category }));
    }
    if (levelFilter && levelFilter !== '__all__') {
        pool = pool.filter(q => q.level === levelFilter);
    }
    return shuffle(pool).slice(0, numQ);
}

// ── Screens ──────────────────────────────────────────────────────────────────
const screens = {
    setup:   document.getElementById('screen-setup'),
    game:    document.getElementById('screen-game'),
    results: document.getElementById('screen-results'),
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// ── State ────────────────────────────────────────────────────────────────────
let state = {};

function startGame() {
    const categoryName = document.getElementById('sel-category').value;
    const numQ = parseInt(document.getElementById('sel-questions').value, 10);
    const levelFilter = document.getElementById('sel-level').value;
    const questions = getQuestions(categoryName, numQ, levelFilter);

    if (!questions.length) {
        document.getElementById('setup-error').textContent = 'Brak pytań dla wybranej kategorii.';
        return;
    }

    state = {
        questions,
        currentQ: 0,
        score: 0,
        answered: false,
        results: [],
    };

    buildProgressBar(questions.length);
    renderQuestion();
    showScreen('game');
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function buildProgressBar(n) {
    const bar = document.getElementById('progress-bar');
    bar.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        bar.appendChild(dot);
    }
}

function updateProgressBar(idx, isCorrect) {
    const dots = document.getElementById('progress-bar').children;
    if (dots[idx]) {
        dots[idx].classList.remove('current');
        dots[idx].classList.add('done');
        if (!isCorrect) dots[idx].classList.add('wrong');
    }
    if (dots[idx + 1]) dots[idx + 1].classList.add('current');
}

function initProgressBar(idx) {
    const dots = document.getElementById('progress-bar').children;
    if (dots[idx]) dots[idx].classList.add('current');
}

// ── Render question ───────────────────────────────────────────────────────────
function renderQuestion() {
    const { currentQ, questions } = state;
    const q = questions[currentQ];

    document.getElementById('q-counter').textContent = `Pytanie ${currentQ + 1} / ${questions.length}`;
    document.getElementById('score-display').textContent = state.score;
    document.getElementById('q-category-name').textContent = q._category;
    document.getElementById('q-subcategory-name').textContent = q.subcategory;
    document.getElementById('q-question').textContent = q.question;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('btn-next').style.display = 'none';

    initProgressBar(currentQ);

    const correctAnswer = q.answers.find(a => a.is_correct);
    const shuffledAnswers = shuffle(q.answers);

    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';
    shuffledAnswers.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = ans.text;
        btn.addEventListener('click', () => handleAnswer(ans, correctAnswer));
        grid.appendChild(btn);
    });

    state.answered = false;
}

// ── Handle answer ─────────────────────────────────────────────────────────────
function handleAnswer(chosen, correct) {
    if (state.answered) return;
    state.answered = true;

    const grid = document.getElementById('answers-grid');
    const btns = grid.querySelectorAll('.answer-btn');
    const isCorrect = chosen.is_correct;

    btns.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct.text) btn.classList.add('correct');
    });

    if (!isCorrect) {
        btns.forEach(btn => {
            if (btn.textContent === chosen.text) btn.classList.add('wrong');
        });
    }

    const fb = document.getElementById('feedback');
    if (isCorrect) {
        state.score++;
        fb.textContent = '✅ Dobrze!';
        fb.className = 'feedback ok';
    } else {
        fb.textContent = `❌ Błąd! Prawidłowa: ${correct.text}`;
        fb.className = 'feedback bad';
    }

    document.getElementById('score-display').textContent = state.score;
    updateProgressBar(state.currentQ, isCorrect);

    state.results.push({
        question: state.questions[state.currentQ],
        chosenText: chosen.text,
        isCorrect,
    });

    document.getElementById('btn-next').style.display = 'inline-block';
}

// ── Next question / finish ────────────────────────────────────────────────────
document.getElementById('btn-next').addEventListener('click', () => {
    state.currentQ++;
    if (state.currentQ >= state.questions.length) {
        showResults();
    } else {
        renderQuestion();
    }
});

// ── Results ───────────────────────────────────────────────────────────────────
function showResults() {
    const { score, questions, results } = state;
    const n = questions.length;
    const pct = score / n;

    document.getElementById('result-score').textContent = score;
    document.getElementById('result-max').textContent = `na ${n} pytań`;

    let comment = '';
    if (pct === 1)       comment = '🏆 Doskonale! Bezbłędny wynik!';
    else if (pct >= 0.8) comment = '🎉 Świetny wynik!';
    else if (pct >= 0.6) comment = '👍 Nieźle!';
    else if (pct >= 0.4) comment = '📖 Jest nad czym popracować.';
    else                 comment = '💪 Spróbuj jeszcze raz!';
    document.getElementById('result-comment').textContent = comment;

    const list = document.getElementById('result-list');
    list.innerHTML = '';
    results.forEach(r => {
        const row = document.createElement('div');
        row.className = 'result-row';
        const icon = r.isCorrect ? '✅' : '❌';
        const correctText = r.question.answers.find(a => a.is_correct).text;
        row.innerHTML = `
            <span class="result-icon">${icon}</span>
            <div class="result-q">
                <div class="q-text">${r.question.question}</div>
                <div class="q-ans">
                    ${r.isCorrect
                        ? `<span class="correct-ans">${r.chosenText}</span>`
                        : `Twoja: ${r.chosenText} → <span class="correct-ans">${correctText}</span>`
                    }
                </div>
            </div>`;
        list.appendChild(row);
    });

    showScreen('results');
}

// ── Replay ────────────────────────────────────────────────────────────────────
document.getElementById('btn-replay').addEventListener('click', () => {
    showScreen('setup');
});

// ── Start button ──────────────────────────────────────────────────────────────
document.getElementById('btn-start').addEventListener('click', () => {
    document.getElementById('setup-error').textContent = '';
    startGame();
});

// ── Init ──────────────────────────────────────────────────────────────────────
loadAllData();
