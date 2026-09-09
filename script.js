/**
 * ============================================================================
 * SD_OS v2.7 - CORE INTERFACE & ROBOTIC COMBAT MECHANICS
 * AUTHOR: SOUMIK_DAS | MODULE: BATTLE SYSTEM INTEGRATION
 * ============================================================================
 */

// --- GLOBAL STATE ENGINE ---
const state = {
    theme: localStorage.getItem('cyber-theme') || 'cyber-dark',
    audioCtx: null,
    canvasResizeTimeout: null,
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    trail: Array(8).fill({ x: 0, y: 0 })
};

// --- SYNCHRONIZE INITIAL DOM GRAPHICS STATE ---
document.documentElement.setAttribute('data-theme', state.theme);

// --- 1. HARDWARE ACCELERATED CUSTOM POINTER INTEGRATION ---
function initCustomCursorSystem() {
    let cursorMain = document.getElementById('custom-cyber-cursor');
    if (!cursorMain) {
        cursorMain = document.createElement('div');
        cursorMain.id = 'custom-cyber-cursor';
        document.body.appendChild(cursorMain);
    }

    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        cursorMain.style.transform = `translate3d(${state.mouse.x}px, ${state.mouse.y}px, 0)`;
    });

    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('.tab-btn, .project-node, .theme-toggle-btn, .cyber-bot')) {
            cursorMain.classList.add('cursor-hover-active');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest('.tab-btn, .project-node, .theme-toggle-btn, .cyber-bot')) {
            cursorMain.classList.remove('cursor-hover-active');
        }
    });
}

// --- 2. RETRO 8-BIT AUTONOMOUS COMBAT ENGINES ---
function triggerRoboticShowdown() {
    // 2a. Inject CSS Styles dynamically for standard structural elements
    const styleBlock = document.createElement('style');
    styleBlock.textContent = `
        .cyber-bot {
            position: fixed;
            bottom: 10px;
            width: 48px;
            height: 48px;
            z-index: 1000;
            image-rendering: pixelated;
            font-size: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: left 4s cubic-bezier(0.25, 0.46, 0.45, 0.94), right 4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.2s ease;
            filter: drop-shadow(0 0 8px rgba(0,240,255,0.4));
            user-select: none;
            pointer-events: none;
        }
        .bot-left { left: -60px; }
        .bot-right { right: -60px; transform: scaleX(-1); }
        
        .bot-spark {
            position: fixed;
            bottom: 25px;
            font-size: 1.2rem;
            z-index: 1001;
            pointer-events: none;
            animation: sparkOut 0.4s ease-out forwards;
        }
        @keyframes sparkOut {
            0% { transform: scale(0.3) translate(0,0); opacity: 1; }
            100% { transform: scale(1.5) translate(var(--mx), var(--my)); opacity: 0; }
        }
    `;
    document.head.appendChild(styleBlock);

    // 2b. Construct Node Units
    const botLeft = document.createElement('div');
    botLeft.className = 'cyber-bot bot-left';
    botLeft.innerHTML = '🤖'; 
    botLeft.style.filter = 'drop-shadow(0 0 10px var(--neon-cyan))';

    const botRight = document.createElement('div');
    botRight.className = 'cyber-bot bot-right';
    botRight.innerHTML = '👾'; 
    botRight.style.filter = 'drop-shadow(0 0 10px var(--neon-magenta))';

    document.body.appendChild(botLeft);
    document.body.appendChild(botRight);

    // 2c. Phase 1: Marching Sequence towards the middle bottom
    setTimeout(() => {
        botLeft.style.left = 'calc(50% - 50px)';
        botRight.style.right = 'calc(50% - 50px)';
    }, 500);

    // 2d. Phase 2: Combat Engagement Logic Loop
    setTimeout(() => {
        let combatTimer = 0;
        const midPointX = window.innerWidth / 2;

        const battleInterval = setInterval(() => {
            playCyberSound('glitch');
            
            const driftL = Math.random() * 15 - 5;
            const driftR = Math.random() * 15 - 10;
            botLeft.style.left = `calc(50% - 50px + ${driftL}px)`;
            botRight.style.right = `calc(50% - 50px + ${driftR}px)`;
            
            botLeft.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            botRight.style.transform = `scaleX(-1) rotate(${Math.random() * 20 - 10}deg)`;

            for(let k = 0; k < 3; k++) {
                const spark = document.createElement('div');
                spark.className = 'bot-spark';
                spark.innerHTML = Math.random() > 0.5 ? '⚡' : '💥';
                spark.style.left = `${midPointX + (Math.random() * 40 - 20)}px`;
                spark.style.setProperty('--mx', `${Math.random() * 60 - 30}px`);
                spark.style.setProperty('--my', `${Math.random() * -60 - 10}px`);
                document.body.appendChild(spark);
                setTimeout(() => spark.remove(), 400);
            }

            combatTimer++;
            if (combatTimer > 12) {
                clearInterval(battleInterval);
                executeResolutionSequence(botLeft, botRight);
            }
        }, 200);

    }, 4600); 

    // 2e. Phase 3: Knockout & Victory Celebration Script Sequence
    function executeResolutionSequence(leftUnit, rightUnit) {
        const leftWins = Math.random() > 0.5;

        leftUnit.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        rightUnit.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        if (leftWins) {
            rightUnit.style.transform = 'scaleX(-1) rotate(-90deg) translateY(15px)';
            rightUnit.style.opacity = '0.4';
            rightUnit.innerHTML = '';

            leftUnit.style.left = 'calc(50% - 24px)';
            leftUnit.innerHTML = '👑'; 
            leftUnit.style.transform = 'scale(1.4) translateY(-15px)';
            leftUnit.style.filter = 'drop-shadow(0 0 20px #39ff14)'; 
        } else {
            leftUnit.style.transform = 'rotate(90deg) translateY(15px)';
            leftUnit.style.opacity = '0.4';
            leftUnit.innerHTML = '';

            rightUnit.style.right = 'calc(50% - 24px)';
            rightUnit.innerHTML = '👑';
            rightUnit.style.transform = 'scaleX(-1) scale(1.4) translateY(-15px)';
            rightUnit.style.filter = 'drop-shadow(0 0 20px #39ff14)';
        }
        playCyberSound('success');
    }
}

// --- 3. SWITCHBOARD PANEL NAVIGATION ROUTER ---
function switchConsole(panelTargetId) {
    playCyberSound('click');
    
    const targetPanel = document.getElementById(`${panelTargetId}-panel`);
    if (!targetPanel) return;

    document.querySelectorAll('.console-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    targetPanel.classList.add('active');
    const targetButtons = document.querySelectorAll(`.tab-btn[onclick*="'${panelTargetId}'"]`);
    targetButtons.forEach(btn => btn.classList.add('active'));
}

// --- 4. CORE MATRIX RENDER LABS (CANVAS DATA BACKGROUND) ---
const canvas = document.getElementById('cyberCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const systemSymbols = '01🧬🎚️📡💻🤖⚔️SD_OS_BTECH_CSE_GAMEDEV_'.split('');
    const fontSize = 14;
    let columns = 0;
    let dropTracks = [];

    function setupCanvasMetrics() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize) + 1;
        dropTracks = Array(columns).fill(1).map(() => Math.random() * -30);
    }
    setupCanvasMetrics();

    window.addEventListener('resize', () => {
        clearTimeout(state.canvasResizeTimeout);
        state.canvasResizeTimeout = setTimeout(setupCanvasMetrics, 150);
    });

    function drawSystemMatrix() {
        const fade = state.theme === 'cyber-dark' ? 'rgba(6, 6, 10, 0.06)' : 'rgba(242, 244, 247, 0.09)';
        const textNeon = state.theme === 'cyber-dark' ? '#00f0ff' : '#ff0055';

        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${fontSize}px monospace`;

        for (let idx = 0; idx < dropTracks.length; idx++) {
            ctx.fillStyle = textNeon;
            const char = systemSymbols[Math.floor(Math.random() * systemSymbols.length)];
            ctx.fillText(char, idx * fontSize, dropTracks[idx] * fontSize);

            if (dropTracks[idx] * fontSize > canvas.height && Math.random() > 0.98) {
                dropTracks[idx] = 0;
            }
            dropTracks[idx] += 0.85;
        }

        let currentX = state.mouse.x;
        let currentY = state.mouse.y;

        state.trail.forEach((point, i) => {
            point.x += (currentX - point.x) * 0.35;
            point.y += (currentY - point.y) * 0.35;

            ctx.beginPath();
            ctx.arc(point.x, point.y, (8 - i) * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = state.theme === 'cyber-dark' ? `rgba(255, 0, 85, ${0.4 - i * 0.05})` : `rgba(0, 240, 255, ${0.4 - i * 0.05})`;
            ctx.fill();

            currentX = point.x;
            currentY = point.y;
        });
    }
    
    function animationEngineLoop() {
        drawSystemMatrix();
        requestAnimationFrame(animationEngineLoop);
    }
    requestAnimationFrame(animationEngineLoop);
}

// --- 5. HARDWARE MULTI-MODE OSCILLATOR AUDIO SYNTHESIZER ---
function initAudio() {
    if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
    }
}

function playCyberSound(type) {
    try {
        initAudio();
const ctx = state.audioCtx;
const osc = ctx.createOscillator();
const gainNode = ctx.createGain();
osc.connect(gainNode);gainNode.connect(ctx.destination);
const now = ctx.currentTime;
if (type === 'click') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
    gainNode.gain.setValueAtTime(0.04, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);osc.start(now);
    osc.stop(now + 0.08);
} else if (type === 'glitch') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(Math.random() * 300 + 80, now);
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
} else if (type === 'success') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(783.99, now + 0.06);
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
}} 
catch (e) {console.warn("Audio node generation block bypassed natively.");

}}
// --- 6. THEME SWITCH CONSOLE INTERACTION MANAGEMENT ---
function toggleCyberTheme() {
    playCyberSound('success');
    state.theme = state.theme === 'cyber-dark' ? 'cyber-light' : 'cyber-dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('cyber-theme', state.theme);
}
// --- 7. LOADER PROCESS DIAGNOSTIC MATRIX INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initCustomCursorSystem();
    const progressBar = document.querySelector('.progress-bar');
    const statusLabel = document.querySelector('.load-status');
    const loadingScreen = document.getElementById('loading-screen');
    let processValue = 0;
    
    const loadInterval = setInterval(() => {
        processValue += Math.floor(Math.random() * 5) + 2;
        
        if (processValue >= 100) {
            processValue = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                playCyberSound('success');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        triggerRoboticShowdown();
                    }, 600);
                }
            }, 400);
        }
        
        // Fixed template string syntax strings here:
        if (progressBar) progressBar.style.width = `${processValue}%`;
        if (statusLabel) statusLabel.textContent = `LOADING SYSTEM: ${processValue}%`;
    }, 55);
});

// --- GLOBAL EXPORTS EXTENSIONS HUB ---
window.switchConsole = switchConsole;
window.toggleCyberTheme = toggleCyberTheme;
