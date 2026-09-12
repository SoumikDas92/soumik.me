/**
 * ============================================================================
 * soumik.me — fresh & natural edition
 * Interactions: panel switching · sprout loader · fireflies canvas ·
 *               pointer firefly · footer clock
 * ============================================================================
 */

const state = {
    isMobile: window.innerWidth < 700,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, seen: false },
    canvasResizeTimeout: null
};

/* ---------------------------------------------------------------------------
 * 1. PANEL SWITCHING — soft crossfade between sections
 * ------------------------------------------------------------------------- */
function switchPanel(panelTargetId) {
    const targetPanel = document.getElementById(`${panelTargetId}-panel`);
    if (!targetPanel) return;

    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });

    targetPanel.classList.add('active');
    document.querySelectorAll(`.tab-btn[onclick*="'${panelTargetId}'"]`).forEach(b => {
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
    });
}
window.switchPanel = switchPanel;

/* ---------------------------------------------------------------------------
 * 2. FIREFLIES CANVAS — soft glowing spores drifting through the dark
 * ------------------------------------------------------------------------- */
const canvas = document.getElementById('fireflies-canvas');
if (canvas && !state.prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const particles = [];

    // Pre-rendered glow sprites (much cheaper than shadowBlur per particle)
    function makeGlowSprite(inner, outer) {
        const size = 64;
        const sprite = document.createElement('canvas');
        sprite.width = size;
        sprite.height = size;
        const sctx = sprite.getContext('2d');
        const grad = sctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, inner);
        grad.addColorStop(0.4, outer);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, size, size);
        return sprite;
    }

    const sprites = [
        makeGlowSprite('rgba(226, 246, 205, 0.95)', 'rgba(158, 208, 162, 0.35)'),  // sage green
        makeGlowSprite('rgba(245, 224, 190, 0.95)', 'rgba(226, 180, 140, 0.30)')   // warm clay
    ];

    function setupCanvas() {
        state.isMobile = window.innerWidth < 700;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const targetCount = state.isMobile ? 22 : Math.min(52, Math.floor(canvas.width * canvas.height / 26000));
        particles.length = 0;

        for (let i = 0; i < targetCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 5 + Math.random() * 14,
                riseSpeed: 0.12 + Math.random() * 0.3,
                swayAmp: 12 + Math.random() * 30,
                swaySpeed: 0.004 + Math.random() * 0.006,
                phase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.008 + Math.random() * 0.015,
                baseAlpha: 0.25 + Math.random() * 0.5,
                sprite: sprites[Math.random() < 0.78 ? 0 : 1]
            });
        }
    }
    setupCanvas();

    window.addEventListener('resize', () => {
        clearTimeout(state.canvasResizeTimeout);
        state.canvasResizeTimeout = setTimeout(setupCanvas, 150);
    });

    let tick = 0;
    function drawFireflies() {
        tick++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of particles) {
            p.y -= p.riseSpeed;
            p.x += Math.sin(tick * p.swaySpeed + p.phase) * 0.35;

            // Wrap gently around the edges
            if (p.y < -30) { p.y = canvas.height + 30; p.x = Math.random() * canvas.width; }
            if (p.x < -30) p.x = canvas.width + 30;
            if (p.x > canvas.width + 30) p.x = -30;

            const twinkle = 0.55 + 0.45 * Math.sin(tick * p.twinkleSpeed + p.phase);
            ctx.globalAlpha = p.baseAlpha * twinkle;
            ctx.drawImage(p.sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    /* -- pointer firefly follows the mouse inside the same loop ------------- */
    const cursorGlow = document.querySelector('.cursor-glow');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        if (cursorGlow && !state.cursor.seen) {
            state.cursor.seen = true;
            cursorGlow.classList.add('is-visible');
        }
    });

    document.body.addEventListener('mouseover', (e) => {
        if (cursorGlow && e.target.closest('.tab-btn, .card, .chip, .brand')) {
            cursorGlow.classList.add('is-hover');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (cursorGlow && e.target.closest('.tab-btn, .card, .chip, .brand')) {
            cursorGlow.classList.remove('is-hover');
        }
    });

    function animationLoop() {
        drawFireflies();

        if (finePointer && cursorGlow) {
            state.cursor.x += (state.mouse.x - state.cursor.x) * 0.12;
            state.cursor.y += (state.mouse.y - state.cursor.y) * 0.12;
            cursorGlow.style.transform =
                `translate(${state.cursor.x - 8}px, ${state.cursor.y - 8}px)`;
        }

        requestAnimationFrame(animationLoop);
    }
    requestAnimationFrame(animationLoop);
} else if (canvas && state.prefersReducedMotion) {
    // Draw one calm, static frame so the scene still feels alive but still
    canvas.style.opacity = '0.5';
}

/* ---------------------------------------------------------------------------
 * 3. SPROUT LOADER — quick, quiet, then gone
 * ------------------------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loader-bar-fill');
    const statusLabel = document.querySelector('.loader-status');

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    /* -- footer clock: the gardener's local time (Kolkata) ----------------- */
    const footerClock = document.getElementById('footer-clock');
    if (footerClock) {
        const clockFormat = new Intl.DateTimeFormat('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        });
        const updateClock = () => { footerClock.textContent = clockFormat.format(new Date()); };
        updateClock();
        setInterval(updateClock, 15000);
    }

    if (!loadingScreen) return;

    // Reduced motion visitors skip the ritual entirely
    if (state.prefersReducedMotion) {
        loadingScreen.style.display = 'none';
        return;
    }

    const loadSteps = [
        { at: 0,  label: 'preparing the soil…' },
        { at: 38, label: 'planting seeds…' },
        { at: 72, label: 'sprouting…' },
        { at: 96, label: 'almost in bloom…' }
    ];

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress = Math.min(100, progress + Math.floor(Math.random() * 7) + 4);

        if (progressBar) progressBar.style.width = `${progress}%`;

        const step = [...loadSteps].reverse().find(s => progress >= s.at);
        if (statusLabel && step) statusLabel.textContent = step.label;

        if (progress >= 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
            }, 250);
        }
    }, 55);
});
