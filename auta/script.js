    const TRANSLATIONS = {
        pl: {
            easyMode: 'TRYB SPOKOJNY\nHave Fun!!!',
            crash: 'KRAKSA!',
            yourScore: 'TWÓJ WYNIK:',
            record: 'REKORD:',
            playAgain: 'ZAGRAJ PONOWNIE',
            resetRecord: 'RESETUJ REKORD',
            confirmReset: 'Wyzerować rekord?'
        },
        en: {
            easyMode: 'EASY MODE\nHave Fun!!!',
            crash: 'CRASH!',
            yourScore: 'YOUR SCORE:',
            record: 'RECORD:',
            playAgain: 'PLAY AGAIN',
            resetRecord: 'RESET RECORD',
            confirmReset: 'Reset high score?'
        }
    };
    const lang = localStorage.getItem('lang') || 'pl';

    function applyLang() {
        const t = TRANSLATIONS[lang];
        updateOverlayInfo();
        document.getElementById('btn-reset-hi').innerText = t.resetRecord;
        document.getElementById('btn-pl').style.borderColor = lang === 'pl' ? '#fff' : '#888';
        document.getElementById('btn-en').style.borderColor = lang === 'en' ? '#fff' : '#888';
    }

    function setLang(l) {
        localStorage.setItem('lang', l);
        location.reload();
    }

    const screen = document.getElementById('screen');
    const player = document.getElementById('player');
    const scoreEl = document.getElementById('score');
    const hiScoreEl = document.getElementById('hi-score');
    const livesEl = document.getElementById('lives');
    const overlay = document.getElementById('overlay');
    const statusTitle = document.getElementById('status-title');
    const finalInfo = document.getElementById('final-info');
    const actionBtn = document.getElementById('action-btn');

    let score = 0;
    let hiScore = parseInt(localStorage.getItem('autoslalom_hi') || '0', 10);
    if (Number.isNaN(hiScore)) hiScore = 0;
    let lives = 3;
    let playerLane = 1;
    let gameActive = false;
    let obstacles = [];
    let spawnTimer = 0;
    let patternStep = 0;
    let framesOnSameLane = 0;
    let lastLane = 1;
    let lastHeartScore = 0;
    let lastHeartTime = 0;
    const HEART_INTERVAL = 15;
    const HIT_RECOVERY_MS = 800;
    const FREE_PASS_BLINK_MS = 250;
    const COLLISION_HORIZONTAL_INSET_PX = 10;
    const COLLISION_VERTICAL_INSET_PX = 6;
    let freePasses = 0;
    let recordBrokenThisRun = false;
    
    const baseSpeed = 4.8; 
    const initialDifficultyOffset = 0;
    let currentSpeed = baseSpeed + (4 * (baseSpeed * 0.05));
    let lanes = [];

    // Zapobieganie menu kontekstowemu przy długim dotknięciu przycisku
    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    function calculateLanes() {
        const sw = screen.clientWidth;
        const carW = 54;
        const padding = (sw - (carW * 4)) / 5;
        lanes = [padding, padding * 2 + carW, padding * 3 + carW * 2, padding * 4 + carW * 3];
    }

    window.addEventListener('resize', calculateLanes);
    calculateLanes();

    function updateHiScoreDisplay() {
        hiScoreEl.innerText = `HI: ${hiScore.toString().padStart(4, '0')}`;
    }

    function updateOverlayInfo() {
        if (finalInfo.dataset.state === 'end') return;
        const t = TRANSLATIONS[lang];
        finalInfo.innerHTML = `${t.easyMode.replace(/\n/g, '<br>')}<br>${t.record} ${hiScore.toString().padStart(4, '0')}`;
    }

    function setRecordTheme(isActive) {
        document.body.classList.toggle('record-beaten', isActive);
    }

    updateHiScoreDisplay();
    applyLang();

    function resetHiScore() {
        if (confirm(TRANSLATIONS[lang].confirmReset)) {
            hiScore = 0;
            localStorage.setItem('autoslalom_hi', '0');
            updateHiScoreDisplay();
            updateOverlayInfo();
        }
    }

    function handleMove(dir) {
        if (!gameActive) return;
        if (dir === 'L' && playerLane > 0) playerLane--;
        if (dir === 'P' && playerLane < 3) playerLane++;
        updatePlayerPos();
    }

    function updatePlayerPos() { 
        player.style.left = lanes[playerLane] + 'px'; 
    }

    window.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowLeft') handleMove('L');
        if(e.key === 'ArrowRight') handleMove('P');
    });

    let touchStartX = null;
    let swipeFired = false;
    screen.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        swipeFired = false;
    }, { passive: true });
    screen.addEventListener('touchmove', (e) => {
        if (touchStartX === null || swipeFired) return;
        const dx = e.touches[0].clientX - touchStartX;
        if (Math.abs(dx) > 15) {
            handleMove(dx < 0 ? 'L' : 'P');
            swipeFired = true;
        }
    }, { passive: true });
    screen.addEventListener('touchend', () => {
        touchStartX = null;
        swipeFired = false;
    }, { passive: true });

    function spawn(laneIdx) {
        const container = document.createElement('div');
        container.className = 'car-shape';
        container.innerHTML = `<div class="wheel w1"></div><div class="wheel w2"></div><div class="car-body"></div><div class="wheel w3"></div><div class="wheel w4"></div>`;
        container.style.top = '-50px';
        container.style.left = lanes[laneIdx] + 'px';
        screen.appendChild(container);
        obstacles.push({ el: container, lane: laneIdx, y: -50 });
    }

    function spawnHeart(laneIdx) {
        const container = document.createElement('div');
        container.className = 'heart-shape';
        container.textContent = '♥';
        container.style.top = '-50px';
        container.style.left = lanes[laneIdx] + 'px';
        screen.appendChild(container);
        obstacles.push({ el: container, lane: laneIdx, y: -50, isHeart: true });
    }

    function isCollidingWithPlayer(obstacle, playerRect) {
        const obstacleRect = obstacle.el.getBoundingClientRect();

        return (
            playerRect.left + COLLISION_HORIZONTAL_INSET_PX < obstacleRect.right - COLLISION_HORIZONTAL_INSET_PX &&
            playerRect.right - COLLISION_HORIZONTAL_INSET_PX > obstacleRect.left + COLLISION_HORIZONTAL_INSET_PX &&
            playerRect.top + COLLISION_VERTICAL_INSET_PX < obstacleRect.bottom - COLLISION_VERTICAL_INSET_PX &&
            playerRect.bottom - COLLISION_VERTICAL_INSET_PX > obstacleRect.top + COLLISION_VERTICAL_INSET_PX
        );
    }

    function consumeObstacle(index) {
        const [removedObstacle] = obstacles.splice(index, 1);
        if (removedObstacle) {
            removedObstacle.el.remove();
        }
    }

    function gameLoop() {
        if(!gameActive) return;

        spawnTimer++;
        if (playerLane === lastLane) framesOnSameLane++;
        else { framesOnSameLane = 0; lastLane = playerLane; }

        let virtualScore = score + initialDifficultyOffset;
        let spawnRate = Math.max(16, 48 - (virtualScore / 2.5));
        
        if(spawnTimer > spawnRate) {
            if (framesOnSameLane > 80) { spawn(playerLane); framesOnSameLane = 0; }
            else {
                let phase = Math.floor(score / 12) % 3;
                if (phase === 0) { spawn(patternStep % 4); patternStep++; }
                else if (phase === 1) {
                    const p = patternStep % 4;
                    if (p === 0) { spawn(0); spawn(3); }
                    else if (p === 1) { spawn(1); spawn(2); }
                    else if (p === 2) { spawn(0); spawn(1); }
                    else { spawn(2); spawn(3); }
                    patternStep++;
                } else {
                    let l1 = Math.floor(Math.random() * 4);
                    spawn(l1);
                    if (virtualScore > 65) spawn((l1 + 2) % 4);
                }
            }
            spawnTimer = 0;
        }

        const screenH = screen.clientHeight;
        const playerRect = player.getBoundingClientRect();

        for(let i = obstacles.length - 1; i >= 0; i--) {
            let o = obstacles[i];
            o.y += currentSpeed;
            o.el.style.top = o.y + 'px';

            if (isCollidingWithPlayer(o, playerRect)) {
                if (o.isHeart) {
                    handleHeartCollect(o, i);
                    continue;
                } else if (freePasses > 0) {
                    handleFreePass(i);
                    continue;
                } else {
                    handleHit(o, i);
                    continue;
                }
            }

            if(o.y > screenH) {
                if (!o.isHeart) {
                    score++;
                    if (!recordBrokenThisRun && score > hiScore) {
                        recordBrokenThisRun = true;
                        setRecordTheme(true);
                    }
                    if(score % 10 === 0) currentSpeed += (baseSpeed * 0.04);
                    scoreEl.innerText = score.toString().padStart(4, '0');

                    if (lives < 3 && score - lastHeartScore >= HEART_INTERVAL && Date.now() - lastHeartTime >= 10000) {
                        const validLanes = [0,1,2,3].filter(l => Math.abs(l - playerLane) >= 2);
                        if (validLanes.length > 0) {
                            const heartLane = validLanes[Math.floor(Math.random() * validLanes.length)];
                            spawnHeart(heartLane);
                            lastHeartScore = score;
                            lastHeartTime = Date.now();
                        }
                    }
                }
                o.el.remove();
                obstacles.splice(i, 1);
            }
        }
        requestAnimationFrame(gameLoop);
    }

    function handleHit(obstacle, index) {
        lives--;
        livesEl.innerText = '♥♥♥'.substring(0, lives);
        obstacle.el.classList.add('blink', 'hit-style');
        player.classList.add('blink', 'hit-style');
        gameActive = false;

        setTimeout(() => {
            obstacle.el.remove();
            obstacles.splice(index, 1);
            player.classList.remove('blink', 'hit-style');
            if(lives <= 0) endGame();
            else {
                freePasses = 1;
                gameActive = true;
                framesOnSameLane = 0;
                gameLoop();
            }
        }, HIT_RECOVERY_MS);
    }

    function handleFreePass(index) {
        freePasses--;
        player.classList.add('blink');
        consumeObstacle(index);
        setTimeout(() => player.classList.remove('blink'), FREE_PASS_BLINK_MS);
    }

    function handleHeartCollect(heart, index) {
        consumeObstacle(index);
        if (lives < 3) {
            lives++;
            livesEl.innerText = '♥♥♥'.substring(0, lives);
        }
    }

    function startGame() {
        calculateLanes();
        document.querySelectorAll('.car-shape:not(#player), .heart-shape').forEach(o => o.remove());
        obstacles = [];
        score = 0; lives = 3; patternStep = 0; framesOnSameLane = 0; lastHeartScore = 0; lastHeartTime = 0;
        freePasses = 0;
        recordBrokenThisRun = false;
        currentSpeed = baseSpeed + (4 * (baseSpeed * 0.05));
        playerLane = 1;
        gameActive = true;
        finalInfo.dataset.state = 'start';
        scoreEl.innerText = '0000';
        livesEl.innerText = '♥♥♥';
        overlay.style.display = 'none';
        player.style.display = 'block';
        setRecordTheme(false);
        updatePlayerPos();
        gameLoop();
    }

    function endGame() {
        gameActive = false;
        if(score > hiScore) {
            hiScore = score;
            localStorage.setItem('autoslalom_hi', hiScore.toString());
            updateHiScoreDisplay();
            updateOverlayInfo();
        }
        statusTitle.innerText = TRANSLATIONS[lang].crash;
        finalInfo.dataset.state = 'end';
        finalInfo.innerHTML = `${TRANSLATIONS[lang].yourScore} ${score.toString().padStart(4, '0')}`;
        actionBtn.innerText = TRANSLATIONS[lang].playAgain;
        overlay.style.display = 'flex';
    }
