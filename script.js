/**
 * Romantic Confetti & Heart Fireworks Canvas Engine
 * Lightweight, zero external dependencies!
 */

class RomanticConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationFrame = null;
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Draw a cute heart shape on canvas
  drawHeart(ctx, x, y, size, color, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;

    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight,
      -size, size / 3,
      0, size
    );
    // Right curve
    ctx.bezierCurveTo(
      size, size / 3,
      size / 2, -topCurveHeight,
      0, topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw a standard rectangular confetti ribbon
  drawRibbon(ctx, x, y, width, height, color, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  }

  // Burst explosion
  burst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 120) {
    const colors = [
      '#ff4081', '#ff79b0', '#ff0055', '#d81b60', '#f48fb1',
      '#ffd54f', '#ffb74d', '#4dd0e1', '#b388ff', '#ffffff'
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      const isHeart = Math.random() > 0.45;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 4 + 2),
        size: isHeart ? (Math.random() * 14 + 10) : (Math.random() * 10 + 6),
        width: Math.random() * 8 + 4,
        height: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.22,
        drag: 0.98,
        alpha: 1,
        fadeSpeed: Math.random() * 0.008 + 0.005,
        isHeart: isHeart
      });
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  // Continuous celebratory shower
  startGrandShower(durationMs = 6000) {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startTime > durationMs) {
        clearInterval(interval);
        return;
      }
      const leftX = Math.random() * (window.innerWidth * 0.4);
      const rightX = window.innerWidth * 0.6 + Math.random() * (window.innerWidth * 0.4);
      this.burst(leftX, window.innerHeight * 0.7, 40);
      this.burst(rightX, window.innerHeight * 0.7, 40);
    }, 450);
  }

  animate() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.alpha -= p.fadeSpeed;

      if (p.alpha <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.isHeart) {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
      } else {
        this.drawRibbon(this.ctx, p.x, p.y, p.width, p.height, p.color, p.alpha, p.rotation);
      }
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.animationFrame = null;
    }
  }
}

/**
 * Romantic Animated Proposal Core Engine
 * Manages scenes, animations, interactions, and customizations
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. INSTANTIATE ENGINES & CANVAS PARTICLES
  // ==========================================
  const confetti = new RomanticConfettiEngine('confettiCanvas');
  
  // Ambient Canvas: Floating Hearts, Petals & Stars
  const ambientCanvas = document.getElementById('ambientCanvas');
  const ambientCtx = ambientCanvas.getContext('2d');
  let ambientParticles = [];

  function resizeAmbient() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  resizeAmbient();
  window.addEventListener('resize', resizeAmbient);

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * ambientCanvas.width;
      this.y = initial ? Math.random() * ambientCanvas.height : ambientCanvas.height + 20;
      this.size = Math.random() * 14 + 10;
      this.speedY = -(Math.random() * 1.2 + 0.6);
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.type = Math.random() > 0.4 ? 'heart' : (Math.random() > 0.5 ? 'petal' : 'star');
      this.color = ['#ff85a2', '#ff4d80', '#ffaec0', '#ffd1dc', '#fcd5ce'][Math.floor(Math.random() * 5)];
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.6 + this.speedX * 0.5;
      this.rotation += this.rotSpeed;

      if (this.y < -30 || this.x < -30 || this.x > ambientCanvas.width + 30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const topH = this.size * 0.3;
        ctx.moveTo(0, topH);
        ctx.bezierCurveTo(-this.size / 2, -topH, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -topH, 0, topH);
        ctx.closePath();
        ctx.fill();
      } else if (this.type === 'petal') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.7, this.size * 0.35, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Soft glowing star/sparkle
        ctx.fillStyle = '#fff4cc';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Create ambient particles
  const particleCount = window.innerWidth < 600 ? 30 : 50;
  for (let i = 0; i < particleCount; i++) {
    ambientParticles.push(new AmbientParticle());
  }

  function loopAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    for (let p of ambientParticles) {
      p.update();
      p.draw(ambientCtx);
    }
    requestAnimationFrame(loopAmbient);
  }
  loopAmbient();

  // Mouse / Touch Sparkle Trail
  let lastSparkleTime = 0;
  function createSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkleTime < 50) return;
    lastSparkleTime = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    const emojis = ['✨', '💖', '🌸', '💫', '💕'];
    sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 900);
  }

  window.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      createSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // ==========================================
  // 2. SCENE TRANSITIONS
  // ==========================================
  const stages = {
    envelope: document.getElementById('stage-envelope'),
    journey: document.getElementById('stage-journey'),
    proposal: document.getElementById('stage-proposal'),
    celebration: document.getElementById('stage-celebration')
  };

  function switchScene(fromKey, toKey) {
    const current = stages[fromKey];
    const next = stages[toKey];
    if (!current || !next) return;

    current.style.opacity = '0';
    current.style.transform = 'translateY(-20px) scale(0.95)';

    setTimeout(() => {
      current.classList.remove('active');
      current.style.opacity = '';
      current.style.transform = '';
      next.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }

  // ==========================================
  // 4. STAGE 1: ENVELOPE INTERACTION
  // ==========================================
  const waxSealBtn = document.getElementById('waxSealBtn');
  const envelope = document.querySelector('.envelope');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;


    if (envelope) {
      envelope.classList.add('opened');
    }

    // Small heart burst from seal
    const rect = waxSealBtn.getBoundingClientRect();
    confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

    // Transition to Journey Scene after letter is seen
    setTimeout(() => {
      switchScene('envelope', 'journey');
    }, 1400);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      openEnvelope();
    });
  }

  // ==========================================
  // 5. STAGE 2: CAROUSEL (OUR STORY)
  // ==========================================
  const slides = document.querySelectorAll('.carousel-slides .slide');
  const dots = document.querySelectorAll('.step-indicator .step-dot');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slideCounter = document.getElementById('slideCounter');
  const goToQuestionBtn = document.getElementById('goToQuestionBtn');
  let currentSlide = 0;

  function updateSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    if (slideCounter) {
      slideCounter.textContent = `${index + 1} / ${slides.length}`;
    }
    currentSlide = index;
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      let nextIndex = (currentSlide - 1 + slides.length) % slides.length;
      updateSlide(nextIndex);
    });
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      let nextIndex = (currentSlide + 1) % slides.length;
      updateSlide(nextIndex);
    });
  }

  if (goToQuestionBtn) {
    goToQuestionBtn.addEventListener('click', () => {
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
      switchScene('journey', 'proposal');
    });
  }

  // ==========================================
  // 6. STAGE 3: RUNAWAY "NO" BUTTON & "YES!"
  // ==========================================
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noBtnText = document.getElementById('noBtnText');
  const playfulStatus = document.getElementById('playfulStatus');
  const buttonZone = document.getElementById('buttonZone');

  let noDodgeCount = 0;
  let yesScale = 1;

  const playfulMessages = [
    "Wait, are you sure? 🥺",
    "Wrong button! Try the green one 😉",
    "Oops, you can't catch me! 🏃‍♂️💨",
    "Pretty please with sprinkles on top? 🌸",
    "Are you really sure? Think again! 💕",
    "My heart can't take this! 💔🥺",
    "Resistance is futile, say YES! 🥰",
    "I believe in us, click YES! ✨"
  ];

  function dodgeNoButton() {
    noDodgeCount++;

    // Change message
    const msg = playfulMessages[noDodgeCount % playfulMessages.length];
    if (playfulStatus) {
      playfulStatus.textContent = msg;
    }
    if (noBtnText) {
      noBtnText.textContent = msg.split(' ')[0] + " 🙈";
    }

    // Grow YES button
    yesScale += 0.15;
    if (yesBtn) {
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Move NO button playfully inside or around buttonZone
    const zoneRect = buttonZone.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(80, window.innerWidth - btnRect.width - 40);
    const maxY = Math.max(80, window.innerHeight - btnRect.height - 40);

    // Calculate random coordinate
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 160;

    noBtn.style.position = 'relative';
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(${Math.max(0.65, 1 - noDodgeCount * 0.05)})`;
  }

  if (noBtn) {
    noBtn.addEventListener('mouseenter', dodgeNoButton);
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeNoButton();
    });
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeNoButton();
    }, { passive: false });
  }

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      // Grand celebration sound

      // Confetti explosion
      const rect = yesBtn.getBoundingClientRect();
      confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 160);
      confetti.startGrandShower(7000);

      // Transition to Stage 4 (Celebration)
      setTimeout(() => {
        switchScene('proposal', 'celebration');
        setTimeout(typeLetter, 600);
      }, 700);
    });
  }

  // ==========================================
  // 7. STAGE 4: CERTIFICATE & COUPONS
  // ==========================================
  // Typewriter love letter
  const letterText = document.getElementById('letterText');
  let typeTimer;
  function typeLetter() {
    if (!letterText) return;
    clearInterval(typeTimer);
    const full = letterText.dataset.text || '';
    letterText.textContent = '';
    let i = 0;
    typeTimer = setInterval(() => {
      letterText.textContent = full.slice(0, ++i);
      if (i >= full.length) clearInterval(typeTimer);
    }, 35);
  }

  // Reasons I love you
  const reasonText = document.getElementById('reasonText');
  document.querySelectorAll('.reason-heart').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('opened');
      if (reasonText) reasonText.textContent = btn.dataset.reason;
      const r = btn.getBoundingClientRect();
      confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 15);
    });
  });

  const replayBtn = document.getElementById('replayBtn');

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      // Reset variables
      envelopeOpened = false;
      if (envelope) envelope.classList.remove('opened');
      noDodgeCount = 0;
      yesScale = 1;
      if (yesBtn) yesBtn.style.transform = 'scale(1)';
      if (noBtn) {
        noBtn.style.position = '';
        noBtn.style.transform = '';
      }
      if (noBtnText) noBtnText.textContent = 'No 🙈';
      if (playfulStatus) playfulStatus.textContent = 'Go ahead... choose carefully! 😉';
      updateSlide(0);
      clearInterval(typeTimer);
      document.querySelectorAll('.reason-heart').forEach(b => b.classList.remove('opened'));
      if (reasonText) reasonText.textContent = 'Pick a heart 💞';

      // Return to stage 1
      switchScene('celebration', 'envelope');
    });
  }

  // Coupons Claim Logic
  const claimButtons = document.querySelectorAll('.claim-btn');
  claimButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.classList.contains('claimed')) return;
      this.classList.add('claimed');
      this.textContent = 'Claimed! 💖';
      const rect = this.getBoundingClientRect();
      confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
    });
  });

  // ==========================================
  // 8. OPTIONAL NAMES VIA URL: ?to=Name&from=Name&q=Question&msg=Message
  // ==========================================
  const params = new URLSearchParams(window.location.search);
  const setText = (id, v) => { const el = document.getElementById(id); if (el && v) el.textContent = v; };
  const herName = params.get('to'), yourName = params.get('from');
  if (herName) { setText('proposalToTag', `For ${herName} 🌹`); setText('letterTo', `Dear ${herName},`); }
  if (yourName) setText('letterFrom', yourName);
  setText('proposalQuestion', params.get('q'));
  setText('proposalSubtext', params.get('msg'));
});