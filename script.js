/**
 * ============================================================================
 * SD_OS v3.0 - STABILIZED UNIVERSAL DEVICE PIPELINE
 * AUTHOR: SOUMIK_DAS | MODULE: CORE PROCESSOR & STABILIZATION
 * ============================================================================
 */

// --- GLOBAL VARIABLES & SYSTEM CAPABILITIES MATRIX ---
const state = {
    theme: localStorage.getItem('cyber-theme') || 'cyber-dark',
    audioCtx: null,
    canvasResizeTimeout: null,
    isMobile: window.innerWidth < 768,
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    trail: Array(5).fill({ x: 0, y: 0 }), 
    matrixFrameCount: 0
};

// --- INITIALIZE THEME SYSTEM CONFIGURATIONS ---
document.documentElement.setAttribute('data-theme', state.theme);

// --- 1. COORDINATED RESPONSIVE MOUSE & INTERACTIVE ACCELEROMETER COGNITION ---
function initCustomCursorSystem() {
    const cursorMain = document.getElementById('custom-cyber-cursor');
    const dockMx = document.getElementById('dock-mx');
    const dockMy = document.getElementById('dock-my');
    
    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        
        // 1a. Update localized numeric data telemetry arrays inside bottom dock values instantly
        if (dockMx) dockMx.textContent = String(state.mouse.x).padStart(3, '0');
        if (dockMy) dockMy.textContent = String(state.mouse.y).padStart(3, '0');
        
        // 1b. Render design pointer elements only on compatible desktop platforms
        if (!state.isMobile && cursorMain) {
            cursorMain.style.transform = `translate3d(${state.mouse.x}px, ${state.mouse.y}px, 0)`;
        }
    });

    document.body.addEventListener('mouseover', (e) => {
        if (!state.isMobile && cursorMain && e.target.closest('.tab-btn, .project-node, .nav-brand')) {
            cursorMain.classList.add('cursor-hover-active');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (!state.isMobile && cursorMain && e.target.closest('.tab-btn, .project-node, .nav-brand')) {
            cursorMain.classList.remove('cursor-hover-active');
        }
    });
}

// --- 2. MULTI-MODE CONSOLE INTERFACE NAVIGATION CONTROLS ---
function switchConsole(panelTargetId) {
    playCyberSound('click');
    const targetPanel = document.getElementById(`${panelTargetId}-panel`);
    if (!targetPanel) return;

    document.querySelectorAll('.console-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    targetPanel.classList.add('active');
    const linkedButtons = document.querySelectorAll(`.tab-btn[onclick*="'${panelTargetId}'"]`);
    linkedButtons.forEach(b => b.classList.add('active'));
}

// --- 3. DYNAMIC LOW-OVERHEAD CANVAS HARDWARE RENDERING ENGINES ---
const canvas = document.getElementById('cyberCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const systemSymbols = '01🧬💻🤖SD_OS_CSE_'.split('');
    const fontSize = 12;
    let columns = 0;
    let dropTracks = [];

    function setupCanvasMetrics() {
        state.isMobile = window.innerWidth < 768;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize) + 1;
        
        // Mobile booster: Cap data matrix columns on small screens to reduce calculations
        const trackCount = state.isMobile ? Math.min(columns, 35) : columns;
        dropTracks = Array(trackCount).fill(1).map(() => Math.random() * -25);
    }
    setupCanvasMetrics();

    window.addEventListener('resize', () => {
        clearTimeout(state.canvasResizeTimeout);
        state.canvasResizeTimeout = setTimeout(setupCanvasMetrics, 150);
    });

    function drawSystemMatrix() {
        state.matrixFrameCount++;
        
        // MOBILE FRAME RATIO OPTIMIZER: Skips alternative calculations on mobile views to prevent overheating
        if (state.isMobile && state.matrixFrameCount % 2 !== 0) {
            return;
        }

        const fade = state.theme === 'cyber-dark' ? 'rgba(6, 6, 10, 0.08)' : 'rgba(242, 244, 247, 0.12)';
        const textNeon = state.theme === 'cyber-dark' ? '#00f0ff' : '#ff0055';

        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${fontSize}px monospace`;

        for (let idx = 0; idx < dropTracks.length; idx++) {
            ctx.fillStyle = textNeon;
            const char = systemSymbols[Math.floor(Math.random() * systemSymbols.length)];
            const xPos = state.isMobile ? (idx * (canvas.width / dropTracks.length)) : (idx * fontSize);
            ctx.fillText(char, xPos, dropTracks[idx] * fontSize);

            if (dropTracks[idx] * fontSize > canvas.height && Math.random() > 0.98) {
                dropTracks[idx] = 0;
            }
            dropTracks[idx] += 0.9;
        }

        // Elastic pointer trail vectors rendered exclusively on top layout configurations
        if (!state.isMobile) {
            let currentX = state.mouse.x;
            let currentY = state.mouse.y;

            state.trail.forEach((point, i) => {
                point.x += (currentX - point.x) * 0.35;
                point.y += (currentY - point.y) * 0.35;

                ctx.beginPath();
                ctx.arc(point.x, point.y, (5 - i) * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = state.theme === 'cyber-dark' ? `rgba(255, 0, 85, ${0.3 - i * 0.05})` : `rgba(0, 240, 255, ${0.3 - i * 0.05})`;
                ctx.fill();

                currentX = point.x;
                currentY = point.y;
            });
        }
    }
    
    function animationEngineLoop() {
        drawSystemMatrix();
        requestAnimationFrame(animationEngineLoop);
    }
    requestAnimationFrame(animationEngineLoop);
}

// --- 4. HARDWARE AUDIOLOGY HARDWARE CONSOLE INTERFACES ---
function initAudio() {
    if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
    }
}

function playCyberSound(type) {
    if (state.isMobile) return; // Suppress sound engine threads on small devices for optimized memory handling
    try {
        initAudio();
        const ctx = state.audioCtx;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(750, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
            gainNode.gain.setValueAtTime(0.04, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now); osc.stop(now + 0.08);
        } else if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(783.99, now + 0.06);
            gainNode.gain.setValueAtTime(0.03, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        }
    } catch (e) {
        console.warn("Audio thread protection bypassed.");
    }
}

// --- 5. THEME SWAPPING OPERATIONAL PIPELINES ---
function toggleCyberTheme() {
    playCyberSound('success');
    state.theme = state.theme === 'cyber-dark' ? 'cyber-light' : 'cyber-dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('cyber-theme', state.theme);
}

// --- 6. ASYNCHRONOUS SIMULATED LOADER SEQUENCES ---
window.addEventListener('DOMContentLoaded', () => {
    initCustomCursorSystem();

    const progressBar = document.querySelector('.progress-bar');
    const statusLabel = document.querySelector('.load-status');
    const loadingScreen = document.getElementById('loading-screen');
    const dockPing = document.getElementById('dock-ping');
    let processValue = 0;
    
    // Periodically fluctuate ping display inside the bottom data dock to simulate active server responses
    setInterval(() => {
        if(dockPing) {
            dockPing.textContent = `${Math.floor(Math.random() * 18) + 12}ms`;
        }
    }, 2500);

    const loadInterval = setInterval(() => {
        processValue += Math.floor(Math.random() * 6) + 3;
        
        if (processValue >= 100) {
            processValue = 100;
            clearInterval(loadInterval);
            
            setTimeout(() => {
                playCyberSound('success');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => loadingScreen.style.display = 'none', 400);
                }
            }, 300);
        }
        
        if (progressBar) progressBar.style.width = `${processValue}%`;
        if (statusLabel) statusLabel.textContent = `LOADING SYSTEM: ${processValue}%`;
    }, 45);
});

// --- CORE SYSTEM REGISTRIES LINK ---
window.switchConsole = switchConsole;
window.toggleCyberTheme = toggleCyberTheme;
