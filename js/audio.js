/* HODL Dog — Audio Engine (Web Audio API synthesized SFX) */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmNode = null;
    this.bgmPlaying = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 1;
      this.initialized = true;
    } catch(e) { console.warn('Audio not available'); }
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  toggle() {
    this.muted = !this.muted;
    if (this.masterGain) this.masterGain.gain.value = this.muted ? 0 : 1;
    return !this.muted;
  }

  // Synthesize tones
  _tone(freq, dur, type='sine', vol=0.3, attack=0.01, decay=0.1) {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + dur);
  }

  _noise(dur, vol=0.15) {
    if (!this.ctx || this.muted) return;
    const bufSize = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    src.connect(gain);
    gain.connect(this.masterGain);
    src.start();
  }

  // 1. Jump light
  jumpLight() {
    this._tone(520, 0.18, 'sine', 0.25);
    this._tone(680, 0.12, 'sine', 0.15);
  }

  // 2. Jump charged
  jumpCharged() {
    this._tone(220, 0.32, 'sawtooth', 0.15);
    this._tone(440, 0.2, 'sine', 0.2);
  }

  // 3. Coin collect (3 variations)
  coinCollect(variation = 0) {
    const freqs = [880, 1047, 1175];
    this._tone(freqs[variation % 3], 0.12, 'square', 0.15);
    setTimeout(() => this._tone(freqs[variation % 3] * 1.5, 0.1, 'sine', 0.12), 60);
  }

  // 4. Gold coin
  goldCoin() {
    this._tone(1047, 0.1, 'sine', 0.2);
    setTimeout(() => this._tone(1319, 0.1, 'sine', 0.18), 80);
    setTimeout(() => this._tone(1568, 0.15, 'sine', 0.15), 160);
    setTimeout(() => this._tone(2093, 0.2, 'sine', 0.12), 260);
  }

  // 5. Power-up rocket
  powerUpRocket() {
    this._noise(0.3, 0.1);
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this._tone(200 + i * 80, 0.08, 'sawtooth', 0.1), i * 80);
    }
  }

  // 6. Magnet
  magnet() {
    this._tone(150, 0.52, 'sine', 0.12);
    this._tone(300, 0.4, 'triangle', 0.08);
  }

  // 7. Death
  death() {
    this._noise(0.15, 0.2);
    setTimeout(() => {
      this._tone(200, 0.3, 'sawtooth', 0.15);
      this._tone(150, 0.4, 'sawtooth', 0.1);
    }, 150);
    setTimeout(() => this._tone(80, 0.5, 'sine', 0.15), 500);
  }

  // 8. Level complete
  levelComplete() {
    const melody = [523, 659, 784, 1047, 784, 1047, 1319];
    melody.forEach((f, i) => {
      setTimeout(() => this._tone(f, 0.25, 'square', 0.12), i * 200);
    });
  }

  // 9. Button click
  buttonClick() {
    this._tone(800, 0.08, 'square', 0.1);
    this._tone(1200, 0.06, 'square', 0.08);
  }

  // 10. Checkpoint
  checkpoint() {
    this._tone(660, 0.15, 'sine', 0.15);
    setTimeout(() => this._tone(880, 0.15, 'sine', 0.15), 120);
    setTimeout(() => this._tone(1100, 0.2, 'sine', 0.12), 240);
  }

  // 11. Combo x2
  comboX2() {
    this._tone(440, 0.12, 'triangle', 0.15);
    setTimeout(() => this._tone(660, 0.12, 'triangle', 0.15), 80);
    setTimeout(() => this._tone(880, 0.15, 'triangle', 0.12), 160);
  }

  // 12. Combo x3
  comboX3() {
    this._tone(440, 0.08, 'sawtooth', 0.12);
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => this._tone(440 + i * 150, 0.08, 'sawtooth', 0.1), i * 60);
    }
    this._noise(0.15, 0.05);
  }

  // 13. Tutorial popup
  tutorialPopup() {
    this._tone(1047, 0.15, 'sine', 0.08);
    setTimeout(() => this._tone(1319, 0.2, 'sine', 0.06), 100);
  }

  // 14. Wallet success
  walletSuccess() {
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((f, i) => {
      setTimeout(() => this._tone(f, 0.2, 'sine', 0.1), i * 100);
    });
    setTimeout(() => this._noise(0.3, 0.06), 300);
  }

  // 15. Error
  error() {
    this._tone(150, 0.3, 'sawtooth', 0.12);
    this._tone(120, 0.4, 'sawtooth', 0.08);
  }

  // BGM — chiptune space loop
  startBGM() {
    if (!this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this._playBGMLoop();
  }

  _playBGMLoop() {
    if (!this.bgmPlaying || !this.ctx) return;
    const bpm = 120;
    const beat = 60 / bpm;
    const notes = [
      262, 330, 392, 330, 262, 330, 392, 523,
      440, 392, 330, 262, 330, 392, 330, 262,
      349, 440, 523, 440, 349, 440, 523, 659,
      523, 440, 392, 349, 392, 440, 392, 349
    ];
    const t = this.ctx.currentTime;
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * beat * 0.25);
      gain.gain.linearRampToValueAtTime(0.04, t + i * beat * 0.25 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (i + 1) * beat * 0.25 - 0.01);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * beat * 0.25);
      osc.stop(t + (i + 1) * beat * 0.25);
    });
    // Bass line
    const bass = [131, 131, 165, 165, 175, 175, 131, 131];
    bass.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, t + i * beat);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (i + 1) * beat - 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * beat);
      osc.stop(t + (i + 1) * beat);
    });
    const loopDur = notes.length * beat * 0.25;
    this._bgmTimer = setTimeout(() => this._playBGMLoop(), loopDur * 1000 - 50);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this._bgmTimer) clearTimeout(this._bgmTimer);
  }

  pauseBGM() {
    this.stopBGM();
  }
}

window.audio = new AudioEngine();
