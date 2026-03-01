/* HODL Dog — Game Engine (Canvas 2D) */
/* Level 1: 1800px wide, 640px view height */

class SpriteRenderer {
  // Procedural pixel-art Doge sprite generation
  static COLORS = {
    body: '#F4D03F', bodyDark: '#D4AC0D', helmet: '#2C3E50', helmetGlow: '#00FF88',
    tongue: '#E74C3C', visor: '#3498DB', visorShine: '#85C1E9', eye: '#2C3E50', white: '#FFFFFF'
  };

  static drawDoge(ctx, x, y, w, h, frame, state) {
    ctx.save();
    ctx.translate(x, y);
    const s = w / 64;
    ctx.scale(s, s);

    // Body
    const breathOffset = Math.sin(frame * 0.3) * 2;
    ctx.fillStyle = SpriteRenderer.COLORS.body;
    ctx.beginPath();
    ctx.roundRect(12, 16 + breathOffset, 40, 36, 8);
    ctx.fill();

    // Darker belly
    ctx.fillStyle = SpriteRenderer.COLORS.bodyDark;
    ctx.beginPath();
    ctx.roundRect(18, 30 + breathOffset, 28, 18, 6);
    ctx.fill();

    // Helmet
    ctx.fillStyle = SpriteRenderer.COLORS.helmet;
    ctx.beginPath();
    ctx.arc(32, 20 + breathOffset, 18, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = SpriteRenderer.COLORS.visor;
    ctx.beginPath();
    ctx.arc(36, 18 + breathOffset, 12, -0.8, 1.2);
    ctx.fill();

    // Visor shine
    ctx.fillStyle = SpriteRenderer.COLORS.visorShine;
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.15) * 0.2;
    ctx.beginPath();
    ctx.ellipse(40, 14 + breathOffset, 4, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Eyes
    ctx.fillStyle = SpriteRenderer.COLORS.eye;
    const blink = frame % 60 < 3 ? 0.3 : 1;
    ctx.save();
    ctx.scale(1, blink);
    const eyeY = (18 + breathOffset) / blink;
    ctx.beginPath();
    ctx.arc(30, eyeY, 2.5, 0, Math.PI * 2);
    ctx.arc(40, eyeY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Eye whites/highlights
    ctx.fillStyle = SpriteRenderer.COLORS.white;
    ctx.beginPath();
    ctx.arc(31, 17 + breathOffset, 1, 0, Math.PI * 2);
    ctx.arc(41, 16 + breathOffset, 1, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = SpriteRenderer.COLORS.body;
    const earWag = Math.sin(frame * 0.4) * 3;
    // Left ear
    ctx.beginPath();
    ctx.moveTo(16, 12 + breathOffset);
    ctx.lineTo(10, -2 + earWag + breathOffset);
    ctx.lineTo(24, 8 + breathOffset);
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.moveTo(42, 10 + breathOffset);
    ctx.lineTo(50, -4 - earWag + breathOffset);
    ctx.lineTo(48, 8 + breathOffset);
    ctx.fill();

    // Tongue (visible in idle/death)
    if (state === 'idle' || state === 'death') {
      ctx.fillStyle = SpriteRenderer.COLORS.tongue;
      const tongueLen = 4 + Math.sin(frame * 0.5) * 2;
      ctx.beginPath();
      ctx.ellipse(38, 26 + breathOffset + tongueLen, 3, tongueLen, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legs
    ctx.fillStyle = SpriteRenderer.COLORS.body;
    const legAnim = state === 'run' ? Math.sin(frame * 0.8) * 6 : 0;
    // Left leg
    ctx.fillRect(18, 50 + breathOffset + legAnim, 8, 12);
    // Right leg
    ctx.fillRect(38, 50 + breathOffset - legAnim, 8, 12);

    // Boots
    ctx.fillStyle = SpriteRenderer.COLORS.helmet;
    ctx.fillRect(16, 58 + breathOffset + legAnim, 12, 6);
    ctx.fillRect(36, 58 + breathOffset - legAnim, 12, 6);

    // Tail
    ctx.strokeStyle = SpriteRenderer.COLORS.body;
    ctx.lineWidth = 4;
    const tailWag = Math.sin(frame * 0.6) * 8;
    ctx.beginPath();
    ctx.moveTo(14, 36 + breathOffset);
    ctx.quadraticCurveTo(4, 30 + tailWag + breathOffset, 2, 20 + tailWag + breathOffset);
    ctx.stroke();

    // Helmet glow (additive)
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = SpriteRenderer.COLORS.helmetGlow;
    ctx.globalAlpha = 0.15 + Math.sin(frame * 0.1) * 0.1;
    ctx.beginPath();
    ctx.arc(32, 20 + breathOffset, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // Jetpack (if jumping)
    if (state === 'jump' || state === 'fall') {
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(8, 24 + breathOffset, 8, 20);
      ctx.fillStyle = '#95a5a6';
      ctx.fillRect(10, 26 + breathOffset, 4, 16);
      // Flame
      if (state === 'jump') {
        ctx.fillStyle = '#E74C3C';
        const flameH = 8 + Math.random() * 10;
        ctx.beginPath();
        ctx.moveTo(8, 44 + breathOffset);
        ctx.lineTo(12, 44 + flameH + breathOffset);
        ctx.lineTo(16, 44 + breathOffset);
        ctx.fill();
        ctx.fillStyle = '#F39C12';
        ctx.beginPath();
        ctx.moveTo(10, 44 + breathOffset);
        ctx.lineTo(12, 44 + flameH * 0.6 + breathOffset);
        ctx.lineTo(14, 44 + breathOffset);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  static drawCoin(ctx, x, y, size, frame, gold = false) {
    ctx.save();
    ctx.translate(x, y);
    const squeeze = Math.abs(Math.cos(frame * (gold ? 0.15 : 0.2)));
    const color1 = gold ? '#FFD700' : '#F1C40F';
    const color2 = gold ? '#FFA500' : '#D4AC0D';
    ctx.scale(squeeze, 1);

    // Outer
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Inner ring
    ctx.strokeStyle = color2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();

    // D symbol
    ctx.fillStyle = color2;
    ctx.font = `bold ${size * 0.5}px ${gold ? 'serif' : 'sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gold ? '🌙' : 'Ð', 0, 0);

    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(-size * 0.15, -size * 0.15, size * 0.15, size * 0.1, -0.5, 0, Math.PI * 2);
    ctx.fill();

    if (gold) {
      // Rainbow trail particles
      for (let i = 0; i < 5; i++) {
        const angle = (frame * 0.1 + i * 1.26);
        const px = Math.cos(angle) * (size * 0.7);
        const py = Math.sin(angle) * (size * 0.7);
        ctx.fillStyle = `hsl(${(frame * 3 + i * 50) % 360},100%,70%)`;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  static drawPlatform(ctx, x, y, w, h, type) {
    ctx.save();
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    switch(type) {
      case 'bouncy':
        grad.addColorStop(0, '#E74C3C');
        grad.addColorStop(1, '#C0392B');
        break;
      case 'disappearing':
        grad.addColorStop(0, 'rgba(52,152,219,0.7)');
        grad.addColorStop(1, 'rgba(41,128,185,0.5)');
        break;
      case 'moving':
        grad.addColorStop(0, '#8E44AD');
        grad.addColorStop(1, '#6C3483');
        break;
      default:
        grad.addColorStop(0, '#1a8a5e');
        grad.addColorStop(1, '#145a3e');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();

    // Top highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(x + 4, y + 2, w - 8, 3);

    // Grass detail for static
    if (type === 'static') {
      ctx.fillStyle = '#27ae60';
      for (let i = 0; i < w; i += 8) {
        ctx.fillRect(x + i, y - 2, 3, 4);
      }
    }
    ctx.restore();
  }

  static drawEnemy(ctx, x, y, w, h, frame) {
    ctx.save();
    ctx.translate(x + w/2, y + h/2);
    const bounce = Math.sin(frame * 0.15) * 3;

    // Bear body
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.roundRect(-w/2, -h/2 + bounce, w, h, 8);
    ctx.fill();

    // Eyes (angry)
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(-8, -6 + bounce, 5, 0, Math.PI * 2);
    ctx.arc(8, -6 + bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-7, -5 + bounce, 2.5, 0, Math.PI * 2);
    ctx.arc(9, -5 + bounce, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.strokeStyle = '#900';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-14, -14 + bounce);
    ctx.lineTo(-4, -10 + bounce);
    ctx.moveTo(14, -14 + bounce);
    ctx.lineTo(4, -10 + bounce);
    ctx.stroke();

    // Mouth
    ctx.strokeStyle = '#900';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 4 + bounce, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // "BEAR" text
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('📉', 0, 14 + bounce);

    ctx.restore();
  }

  static drawFlag(ctx, x, y) {
    // Pole
    ctx.fillStyle = '#BDC3C7';
    ctx.fillRect(x, y - 80, 4, 80);
    // Flag
    ctx.fillStyle = '#00FF88';
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 80);
    ctx.lineTo(x + 44, y - 65);
    ctx.lineTo(x + 4, y - 50);
    ctx.fill();
    // Moon symbol
    ctx.fillStyle = '#FFF';
    ctx.font = '20px serif';
    ctx.fillText('🌙', x + 10, y - 58);
  }

  static drawRocket(ctx, x, y, size, frame) {
    ctx.save();
    ctx.translate(x, y);
    const s = size / 48;
    ctx.scale(s, s);

    // Body
    ctx.fillStyle = '#ECF0F1';
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.quadraticCurveTo(14, -18, 14, 10);
    ctx.lineTo(-14, 10);
    ctx.quadraticCurveTo(-14, -18, 0, -24);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.quadraticCurveTo(8, -24, 6, -16);
    ctx.lineTo(-6, -16);
    ctx.quadraticCurveTo(-8, -24, 0, -28);
    ctx.fill();

    // Window
    ctx.fillStyle = '#3498DB';
    ctx.beginPath();
    ctx.arc(0, -4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(-2, -6, 3, 0, Math.PI * 2);
    ctx.fill();

    // Fins
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.moveTo(-14, 6);
    ctx.lineTo(-22, 18);
    ctx.lineTo(-10, 12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, 6);
    ctx.lineTo(22, 18);
    ctx.lineTo(10, 12);
    ctx.fill();

    // Flame
    const flameH = 12 + Math.sin(frame * 0.8) * 6;
    ctx.fillStyle = '#F39C12';
    ctx.beginPath();
    ctx.moveTo(-8, 10);
    ctx.quadraticCurveTo(0, 10 + flameH, 8, 10);
    ctx.fill();
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.moveTo(-5, 10);
    ctx.quadraticCurveTo(0, 10 + flameH * 0.7, 5, 10);
    ctx.fill();

    ctx.restore();
  }
}

// Particle System
class Particle {
  constructor(x, y, vx, vy, color, life, size, gravity = 0) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.color = color; this.life = this.maxLife = life;
    this.size = size; this.gravity = gravity;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += this.gravity; this.life--;
  }
  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    const s = this.size * alpha;
    ctx.fillRect(this.x - s/2, this.y - s/2, s, s);
    ctx.globalAlpha = 1;
  }
  get dead() { return this.life <= 0; }
}

class ParticleSystem {
  constructor() { this.particles = []; }

  emit(x, y, type) {
    switch(type) {
      case 'coin':
        for (let i = 0; i < 25; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          this.particles.push(new Particle(
            x, y, Math.cos(angle)*speed, Math.sin(angle)*speed - 2,
            ['#FFD700','#F1C40F','#FFA500'][i%3], 48, 3+Math.random()*3, -0.3
          ));
        }
        break;
      case 'jump':
        for (let i = 0; i < 12; i++) {
          this.particles.push(new Particle(
            x + (Math.random()-0.5)*20, y,
            (Math.random()-0.5)*2, -Math.random()*2,
            'rgba(255,255,255,0.7)', 20, 4+Math.random()*4, 0.1
          ));
        }
        break;
      case 'death':
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          this.particles.push(new Particle(
            x, y, Math.cos(angle)*speed, Math.sin(angle)*speed,
            ['#E74C3C','#F39C12','#FF6B6B','#FFD700'][i%4], 60, 3+Math.random()*5, 0.15
          ));
        }
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * Math.PI * 2;
          this.particles.push(new Particle(
            x, y, Math.cos(angle)*3, Math.sin(angle)*3,
            '#FFF', 40, 2, 0
          ));
        }
        break;
      case 'flame':
        for (let i = 0; i < 8; i++) {
          this.particles.push(new Particle(
            x + (Math.random()-0.5)*10, y,
            (Math.random()-0.5)*1, 1+Math.random()*2,
            ['#F39C12','#E74C3C','#FF6B6B'][i%3], 15, 4, 0
          ));
        }
        break;
    }
  }

  update() {
    this.particles = this.particles.filter(p => { p.update(); return !p.dead; });
  }
  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }
}

// Main Game Class
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.running = false;
    this.paused = false;
    this.frameCount = 0;
    this.score = 0;
    this.coins = 0;
    this.multiplier = 1;
    this.comboTimer = 0;
    this.state = 'idle'; // idle, playing, dead, complete, paused
    this.particles = new ParticleSystem();
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;
    this.tutorialStep = 0;
    this.tutorialTimer = 0;

    // Viewport
    this.viewW = 0;
    this.viewH = 0;
    this.camX = 0;

    // Player
    this.player = {
      x: 60, y: 0, vx: 0, vy: 0,
      w: 48, h: 56,
      grounded: false, facing: 1,
      jumpHold: 0, state: 'idle'
    };

    // Level data
    this.levelWidth = 1800;
    this.platforms = [];
    this.collectibles = [];
    this.enemies = [];
    this.finishX = 1720;
    this.startTime = 0;
    this.endTime = 0;

    // Input
    this.keys = {};
    this.touchInput = { left: false, right: false, jump: false };

    // Physics constants
    this.GRAVITY = 0.68;
    this.JUMP_FORCE = -15.2;
    this.JUMP_CHARGE_MAX = -4;
    this.MOVE_SPEED = 5.8;
    this.COYOTE_TIME = 8; // frames (140ms @ 60fps ≈ 8)
    this.JUMP_BUFFER = 7; // frames (120ms)

    this.initLevel();
    this.resize();
  }

  initLevel() {
    // Level 1 platforms — exact coordinates
    this.platforms = [
      // Start platform
      { x: 0, y: 480, w: 260, h: 24, type: 'static' },
      // Platform chain
      { x: 300, y: 440, w: 120, h: 20, type: 'static' },
      { x: 480, y: 390, w: 100, h: 20, type: 'static' },
      { x: 620, y: 420, w: 140, h: 20, type: 'moving', moveX: 120, speed: 1.8, origX: 620 },
      { x: 820, y: 360, w: 80, h: 20, type: 'disappearing', timer: 192, origTimer: 192 }, // 3.2s
      { x: 940, y: 320, w: 100, h: 20, type: 'static' },
      { x: 1080, y: 380, w: 120, h: 20, type: 'bouncy' },
      { x: 1220, y: 280, w: 100, h: 20, type: 'static' },
      { x: 1340, y: 340, w: 80, h: 20, type: 'disappearing', timer: 192, origTimer: 192 },
      { x: 1460, y: 400, w: 140, h: 20, type: 'moving', moveX: 120, speed: 1.8, origX: 1460 },
      { x: 1640, y: 450, w: 160, h: 24, type: 'static' }, // Finish platform
    ];

    // Collectibles — 28 coins
    this.collectibles = [
      // Start area
      { x:100,y:450,type:'normal',collected:false },{ x:140,y:450,type:'normal',collected:false },
      { x:180,y:440,type:'normal',collected:false },{ x:220,y:430,type:'normal',collected:false },
      // Mid section
      { x:340,y:410,type:'normal',collected:false },{ x:380,y:400,type:'normal',collected:false },
      { x:510,y:360,type:'normal',collected:false },{ x:540,y:350,type:'normal',collected:false },
      { x:660,y:380,type:'normal',collected:false },{ x:700,y:370,type:'gold',collected:false },
      { x:860,y:330,type:'normal',collected:false },
      { x:960,y:290,type:'normal',collected:false },{ x:1000,y:280,type:'normal',collected:false },
      { x:1120,y:340,type:'normal',collected:false },{ x:1160,y:330,type:'normal',collected:false },
      { x:1140,y:350,type:'gold',collected:false },
      { x:1260,y:250,type:'normal',collected:false },{ x:1300,y:240,type:'normal',collected:false },
      { x:1380,y:310,type:'normal',collected:false },
      { x:1500,y:370,type:'normal',collected:false },{ x:1540,y:360,type:'normal',collected:false },
      { x:1580,y:350,type:'gold',collected:false },
      { x:1680,y:420,type:'normal',collected:false },{ x:1720,y:410,type:'normal',collected:false },
      // Bonus high coins
      { x:500,y:300,type:'normal',collected:false },{ x:960,y:240,type:'normal',collected:false },
      { x:1260,y:200,type:'gold',collected:false },{ x:1700,y:380,type:'normal',collected:false },
    ];

    // Enemies — 5 bears
    this.enemies = [
      { x:420, y:456, w:36, h:36, range:180, speed:1.2, origX:420, dir:1, jumpH:80, jumpTimer:0 },
      { x:770, y:376, w:36, h:36, range:140, speed:1.0, origX:770, dir:1, jumpH:60, jumpTimer:0 },
      { x:1040, y:396, w:36, h:36, range:100, speed:1.4, origX:1040, dir:-1, jumpH:80, jumpTimer:0 },
      { x:1380, y:356, w:36, h:36, range:160, speed:1.1, origX:1380, dir:1, jumpH:70, jumpTimer:0 },
      { x:1580, y:466, w:36, h:36, range:120, speed:1.3, origX:1580, dir:-1, jumpH:80, jumpTimer:0 },
    ];
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.min(window.innerWidth, 960);
    const ch = Math.min(window.innerHeight, 640);
    this.canvas.width = cw * dpr;
    this.canvas.height = ch * dpr;
    this.canvas.style.width = cw + 'px';
    this.canvas.style.height = ch + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.viewW = cw;
    this.viewH = ch;
  }

  start() {
    this.running = true;
    this.state = 'playing';
    this.score = 0;
    this.coins = 0;
    this.multiplier = 1;
    this.comboTimer = 0;
    this.player.x = 60;
    this.player.y = 420;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.grounded = false;
    this.tutorialStep = 0;
    this.tutorialTimer = 0;
    this.startTime = Date.now();
    this.initLevel();
    this.camX = 0;

    window.audio?.init();
    window.audio?.resume();
    window.audio?.startBGM();

    if (!this._looping) {
      this._looping = true;
      this.loop();
    }
  }

  stop() {
    this.running = false;
    this._looping = false;
    window.audio?.stopBGM();
  }

  pause() {
    this.paused = true;
    this.state = 'paused';
    window.audio?.pauseBGM();
  }

  unpause() {
    this.paused = false;
    this.state = 'playing';
    window.audio?.startBGM();
  }

  loop() {
    if (!this._looping) return;
    requestAnimationFrame(() => this.loop());
    if (this.paused) return;
    this.frameCount++;
    this.update();
    this.draw();
  }

  update() {
    if (this.state !== 'playing') return;
    const p = this.player;

    // Input → velocity
    let moveDir = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchInput.left) moveDir = -1;
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchInput.right) moveDir = 1;
    p.vx = moveDir * this.MOVE_SPEED;
    if (moveDir !== 0) p.facing = moveDir;

    // Jump
    const jumpPressed = this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'] || this.touchInput.jump;
    if (jumpPressed) this.jumpBuffer = this.JUMP_BUFFER;
    else this.jumpBuffer = Math.max(0, this.jumpBuffer - 1);

    if (this.jumpBuffer > 0 && (p.grounded || this.coyoteTimer > 0)) {
      p.vy = this.JUMP_FORCE;
      p.grounded = false;
      this.coyoteTimer = 0;
      this.jumpBuffer = 0;
      p.jumpHold = 0;
      this.particles.emit(p.x + p.w/2, p.y + p.h, 'jump');
      window.audio?.jumpLight();
    }

    // Jump hold (charge)
    if (jumpPressed && p.vy < 0 && p.jumpHold < 24) { // 400ms
      p.vy += this.JUMP_CHARGE_MAX / 24;
      p.jumpHold++;
    }

    // Gravity
    p.vy += this.GRAVITY;
    if (p.vy > 18) p.vy = 18;

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Coyote time
    if (p.grounded) this.coyoteTimer = this.COYOTE_TIME;
    else this.coyoteTimer = Math.max(0, this.coyoteTimer - 1);

    p.grounded = false;

    // Platform collision
    for (const plat of this.platforms) {
      if (plat.type === 'disappearing' && plat.timer <= 0) continue;

      let px = plat.x, py = plat.y, pw = plat.w, ph = plat.h;
      // Moving platform
      if (plat.type === 'moving') {
        plat.x = plat.origX + Math.sin(this.frameCount * 0.02 * plat.speed) * plat.moveX;
        px = plat.x;
      }

      // AABB with 2px tolerance
      if (p.x + p.w > px + 2 && p.x < px + pw - 2) {
        if (p.y + p.h >= py && p.y + p.h <= py + ph + 10 && p.vy >= 0) {
          p.y = py - p.h;
          p.vy = 0;
          p.grounded = true;
          p.jumpHold = 0;

          if (plat.type === 'bouncy') {
            p.vy = this.JUMP_FORCE * 1.6;
            p.grounded = false;
            window.audio?.jumpCharged();
          }
          if (plat.type === 'disappearing') {
            plat.timer--;
          }
          if (plat.type === 'moving') {
            // Move player with platform
            p.x += Math.cos(this.frameCount * 0.02 * plat.speed) * plat.moveX * 0.02 * plat.speed;
          }
        }
      }

      // Disappearing platform timer
      if (plat.type === 'disappearing' && !p.grounded) {
        // Reset if player not on it
      }
    }

    // Boundaries
    if (p.x < 0) p.x = 0;
    if (p.x > this.levelWidth - p.w) p.x = this.levelWidth - p.w;

    // Fall death
    if (p.y > this.viewH + 100) {
      this.die();
      return;
    }

    // Collectible collision
    this.collectibles.forEach((c, idx) => {
      if (c.collected) return;
      const cSize = c.type === 'gold' ? 40 : 32;
      const cx = c.x, cy = c.y;
      if (Math.abs((p.x + p.w/2) - cx) < cSize/2 + p.w/4 &&
          Math.abs((p.y + p.h/2) - cy) < cSize/2 + p.h/4) {
        c.collected = true;
        const val = c.type === 'gold' ? 50 : 10;
        this.coins += val * this.multiplier;
        this.score += val * this.multiplier * 10;
        this.comboTimer = 120; // 2s
        this.particles.emit(cx, cy, 'coin');
        if (c.type === 'gold') {
          window.audio?.goldCoin();
          this.multiplier = Math.min(this.multiplier + 1, 5);
          if (this.multiplier >= 3) window.audio?.comboX3();
          else if (this.multiplier >= 2) window.audio?.comboX2();
        } else {
          window.audio?.coinCollect(idx);
        }
      }
    });

    // Combo decay
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) this.multiplier = 1;
    }

    // Enemy update & collision
    this.enemies.forEach(e => {
      e.x += e.speed * e.dir;
      if (e.x > e.origX + e.range || e.x < e.origX - e.range) e.dir *= -1;
      e.jumpTimer++;
      const jumpY = Math.sin(e.jumpTimer * 0.05) * e.jumpH;

      const ex = e.x, ey = e.y + (jumpY < 0 ? jumpY : 0);
      if (p.x + p.w > ex + 4 && p.x < ex + e.w - 4 &&
          p.y + p.h > ey + 4 && p.y < ey + e.h - 4) {
        // Check if player is stomping
        if (p.vy > 0 && p.y + p.h < ey + e.h/2) {
          e.y = 9999; // Remove
          p.vy = this.JUMP_FORCE * 0.7;
          this.score += 200;
          window.audio?.coinCollect(0);
        } else {
          this.die();
          return;
        }
      }
    });

    // Multiplier flame trail
    if (this.multiplier > 1 && this.frameCount % 3 === 0) {
      this.particles.emit(p.x + p.w/2, p.y + p.h, 'flame');
    }

    // Camera follow
    const targetCam = p.x - this.viewW * 0.35;
    this.camX += (targetCam - this.camX) * 0.08;
    this.camX = Math.max(0, Math.min(this.camX, this.levelWidth - this.viewW));

    // Finish line check
    if (p.x > this.finishX) {
      this.complete();
    }

    // Player state
    if (p.grounded) {
      p.state = Math.abs(p.vx) > 0.5 ? 'run' : 'idle';
    } else {
      p.state = p.vy < 0 ? 'jump' : 'fall';
    }

    // Particles
    this.particles.update();

    // Tutorial
    if (this.tutorialStep === 0 && this.frameCount > 60) {
      this.tutorialStep = 1;
      this.tutorialTimer = 150;
      if (this.onTutorial) this.onTutorial('tutorial_move');
    } else if (this.tutorialStep === 1 && this.tutorialTimer > 0) {
      this.tutorialTimer--;
      if (this.tutorialTimer <= 0) {
        this.tutorialStep = 2;
        this.tutorialTimer = 150;
        if (this.onTutorial) this.onTutorial('tutorial_jump');
      }
    } else if (this.tutorialStep === 2 && this.tutorialTimer > 0) {
      this.tutorialTimer--;
      if (this.tutorialTimer <= 0) {
        this.tutorialStep = 3;
        this.tutorialTimer = 150;
        if (this.onTutorial) this.onTutorial('tutorial_collect');
      }
    } else if (this.tutorialStep === 3 && this.tutorialTimer > 0) {
      this.tutorialTimer--;
      if (this.tutorialTimer <= 0) {
        this.tutorialStep = 99;
        if (this.onTutorial) this.onTutorial(null);
      }
    }

    // Score from distance
    this.score += 1;
  }

  die() {
    this.state = 'dead';
    this.endTime = Date.now();
    this.particles.emit(this.player.x + this.player.w/2, this.player.y + this.player.h/2, 'death');
    window.audio?.death();
    window.audio?.stopBGM();
    if (this.onDeath) this.onDeath(this.score, this.coins);
  }

  complete() {
    this.state = 'complete';
    this.endTime = Date.now();
    window.audio?.levelComplete();
    window.audio?.stopBGM();
    if (this.onComplete) this.onComplete(this.score, this.coins, this.endTime - this.startTime);
  }

  draw() {
    const ctx = this.ctx;
    const vw = this.viewW, vh = this.viewH;
    ctx.clearRect(0, 0, vw, vh);

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, vh);
    bgGrad.addColorStop(0, '#0a0a2e');
    bgGrad.addColorStop(0.5, '#1a1a4e');
    bgGrad.addColorStop(1, '#0a2a3e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, vw, vh);

    // Stars (parallax layer 1)
    this.drawStars(ctx, vw, vh);

    // Moon
    ctx.fillStyle = '#FFF';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(vw * 0.85 - this.camX * 0.05, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0a2e';
    ctx.beginPath();
    ctx.arc(vw * 0.85 - this.camX * 0.05 + 12, 74, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Mountains (parallax layer 2)
    this.drawMountains(ctx, vw, vh);

    ctx.save();
    ctx.translate(-this.camX, 0);

    // Platforms
    this.platforms.forEach(plat => {
      if (plat.type === 'disappearing' && plat.timer <= 0) return;
      let alpha = 1;
      if (plat.type === 'disappearing') {
        alpha = Math.max(0.2, plat.timer / plat.origTimer);
      }
      ctx.globalAlpha = alpha;
      SpriteRenderer.drawPlatform(ctx, plat.x, plat.y, plat.w, plat.h, plat.type);
      ctx.globalAlpha = 1;
    });

    // Collectibles
    this.collectibles.forEach(c => {
      if (c.collected) return;
      SpriteRenderer.drawCoin(ctx, c.x, c.y, c.type === 'gold' ? 40 : 32, this.frameCount, c.type === 'gold');
    });

    // Enemies
    this.enemies.forEach(e => {
      if (e.y > 999) return;
      const jumpY = Math.sin(e.jumpTimer * 0.05) * e.jumpH;
      SpriteRenderer.drawEnemy(ctx, e.x, e.y + (jumpY < 0 ? jumpY : 0), e.w, e.h, this.frameCount);
    });

    // Finish flag
    SpriteRenderer.drawFlag(ctx, this.finishX, this.platforms[this.platforms.length-1].y);

    // Player
    if (this.state !== 'dead') {
      const p = this.player;
      ctx.save();
      if (p.facing < 0) {
        ctx.translate(p.x + p.w, p.y);
        ctx.scale(-1, 1);
        SpriteRenderer.drawDoge(ctx, 0, 0, p.w, p.h, this.frameCount, p.state);
      } else {
        SpriteRenderer.drawDoge(ctx, p.x, p.y, p.w, p.h, this.frameCount, p.state);
      }
      ctx.restore();
    }

    // Particles
    this.particles.draw(ctx);

    ctx.restore();

    // Distance progress
    if (this.onHudUpdate) {
      const dist = Math.min(1, this.player.x / this.finishX);
      this.onHudUpdate(this.coins, dist, this.multiplier, this.score);
    }
  }

  drawStars(ctx, vw, vh) {
    if (!this._stars) {
      this._stars = [];
      for (let i = 0; i < 120; i++) {
        this._stars.push({
          x: Math.random() * 2400,
          y: Math.random() * vh * 0.8,
          size: 0.5 + Math.random() * 2,
          speed: 0.1 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    ctx.fillStyle = '#FFF';
    this._stars.forEach(s => {
      const sx = ((s.x - this.camX * s.speed) % (vw + 100) + vw + 100) % (vw + 100);
      const alpha = 0.3 + 0.5 * Math.sin(this.frameCount * 0.05 + s.phase);
      ctx.globalAlpha = alpha;
      ctx.fillRect(sx, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1;
  }

  drawMountains(ctx, vw, vh) {
    ctx.fillStyle = '#1a1a4e';
    ctx.beginPath();
    ctx.moveTo(0, vh);
    for (let x = 0; x <= vw; x += 60) {
      const mx = x - (this.camX * 0.3) % 200;
      const h = 120 + Math.sin(mx * 0.01) * 60 + Math.sin(mx * 0.025) * 30;
      ctx.lineTo(x, vh - h);
    }
    ctx.lineTo(vw, vh);
    ctx.fill();

    ctx.fillStyle = '#151540';
    ctx.beginPath();
    ctx.moveTo(0, vh);
    for (let x = 0; x <= vw; x += 40) {
      const mx = x - (this.camX * 0.5) % 160;
      const h = 80 + Math.sin(mx * 0.015 + 1) * 40 + Math.sin(mx * 0.03) * 20;
      ctx.lineTo(x, vh - h);
    }
    ctx.lineTo(vw, vh);
    ctx.fill();
  }

  // Input handlers
  bindInput() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.code === 'Escape') {
        if (this.state === 'playing') this.pause();
        else if (this.state === 'paused') this.unpause();
      }
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
  }

  getProgress() {
    return Math.min(1, this.player.x / this.finishX);
  }
}

window.Game = Game;
window.SpriteRenderer = SpriteRenderer;
