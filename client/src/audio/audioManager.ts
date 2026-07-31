type SoundName = 'uiClick' | 'diceShake' | 'diceRoll' | 'coinGain' | 'coinLoss' | 'fortune' | 'turnEnd';

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const MUSIC_NOTES = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23];
const STORAGE_KEY = 'monopoly-cat-audio-muted';

class GameAudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private musicStep = 0;
  private muted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.muted = window.localStorage.getItem(STORAGE_KEY) === 'true';
    }
  }

  get isMuted() {
    return this.muted;
  }

  private ensureGraph() {
    if (this.context) return this.context;
    const AudioContextCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioContextCtor) return null;

    this.context = new AudioContextCtor();
    this.masterGain = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.musicGain.gain.value = 0.22;
    this.sfxGain.gain.value = 0.75;
    this.masterGain.gain.value = this.muted ? 0 : 1;
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
    return this.context;
  }

  initFromGesture() {
    const context = this.ensureGraph();
    if (!context) return;
    if (context.state === 'suspended') void context.resume();
    this.startMusic();
  }

  private tone(frequency: number, duration: number, gain: number, type: OscillatorType, bus: GainNode, when = 0) {
    const context = this.ensureGraph();
    if (!context) return;
    const start = context.currentTime + when;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(bus);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  startMusic() {
    if (this.musicTimer || !this.musicGain) return;
    this.musicStep = 0;
    const playStep = () => {
      if (!this.context || !this.musicGain || this.muted) return;
      const note = MUSIC_NOTES[this.musicStep % MUSIC_NOTES.length];
      this.tone(note, 0.32, 0.07, 'triangle', this.musicGain);
      if (this.musicStep % 4 === 0) this.tone(note / 2, 0.58, 0.045, 'sine', this.musicGain, 0.015);
      this.musicStep += 1;
    };
    playStep();
    this.musicTimer = setInterval(playStep, 500);
  }

  stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  setMuted(nextMuted: boolean) {
    this.muted = nextMuted;
    window.localStorage.setItem(STORAGE_KEY, String(nextMuted));
    if (this.masterGain) this.masterGain.gain.setTargetAtTime(nextMuted ? 0 : 1, this.context?.currentTime ?? 0, 0.025);
    if (nextMuted) this.stopMusic();
    else this.initFromGesture();
  }

  toggleMuted() {
    this.setMuted(!this.muted);
  }

  playSfx(name: SoundName) {
    const context = this.ensureGraph();
    if (!context || this.muted || !this.sfxGain) return;
    if (context.state === 'suspended') void context.resume();

    const jitter = 1 + (Math.random() - 0.5) * 0.08;
    switch (name) {
      case 'uiClick':
        this.tone(520 * jitter, 0.055, 0.13, 'sine', this.sfxGain);
        break;
      case 'diceShake':
        this.tone(170 * jitter, 0.08, 0.1, 'square', this.sfxGain);
        this.tone(230 * jitter, 0.06, 0.07, 'square', this.sfxGain, 0.07);
        break;
      case 'diceRoll':
        this.tone(280 * jitter, 0.12, 0.14, 'triangle', this.sfxGain);
        this.tone(420 * jitter, 0.2, 0.16, 'triangle', this.sfxGain, 0.08);
        break;
      case 'coinGain':
        [659.25, 783.99, 987.77].forEach((note, index) => this.tone(note * jitter, 0.28, 0.14, 'triangle', this.sfxGain!, index * 0.07));
        break;
      case 'coinLoss':
        [392, 329.63, 261.63].forEach((note, index) => this.tone(note * jitter, 0.24, 0.12, 'sine', this.sfxGain!, index * 0.08));
        break;
      case 'fortune':
        [392, 523.25, 659.25, 783.99].forEach((note, index) => this.tone(note, 0.22, 0.11, 'triangle', this.sfxGain!, index * 0.075));
        break;
      case 'turnEnd':
        this.tone(392 * jitter, 0.11, 0.1, 'triangle', this.sfxGain);
        this.tone(523.25 * jitter, 0.2, 0.12, 'triangle', this.sfxGain, 0.08);
        break;
    }
  }
}

export const gameAudio = new GameAudioManager();
