type SoundName = 'uiClick' | 'diceShake' | 'diceRoll' | 'coinGain' | 'coinLoss' | 'fortune' | 'turnEnd' | 'stepHop' | 'zoomAction' | 'purchase' | 'build' | 'roomReady' | 'land';
type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
const dbGain = (db: number) => Math.pow(10, db / 20);
const CHORDS = [[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
const MELODY = [523.25,0,659.25,783.99,659.25,0,587.33,523.25,440,0,523.25,659.25,587.33,523.25,0,440,523.25,659.25,0,698.46,659.25,523.25,440,0,587.33,0,659.25,587.33,493.88,392,0,0];

class GameAudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private effects: GainNode | null = null;
  private ui: GainNode | null = null;
  private ambience: GainNode | null = null;
  private wind: AudioBufferSourceNode | null = null;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private ambienceTimer: ReturnType<typeof setInterval> | null = null;
  private nextBeat = 0;
  private step = 0;
  private playing = false;
  private listeners = new Set<() => void>();
  private muted = localStorage.getItem('monopoly-cat-audio-muted') === 'true';
  private musicEnabled = localStorage.getItem('monopoly-music-enabled') !== 'false';
  private ambienceEnabled = localStorage.getItem('monopoly-ambience-enabled') !== 'false';
  private volume = Math.max(0, Math.min(1, Number(localStorage.getItem('monopoly-sfx-volume') ?? '.8')));
  private lastClick = 0;
  private lastDuck = 0;
  private visibilityChanged = () => {
    if (document.hidden) { this.stopMusic(); this.stopAmbience(); void this.context?.suspend(); }
    else if (this.context) this.initFromGesture();
  };

  constructor() {
    document.addEventListener('visibilitychange',this.visibilityChanged);
  }
  dispose() { this.stopMusic();this.stopAmbience();document.removeEventListener('visibilitychange',this.visibilityChanged);void this.context?.close();this.context=null;this.listeners.clear(); }
  get isMuted() { return this.muted; }
  get settings() { return { muted: this.muted, music: this.musicEnabled, ambience: this.ambienceEnabled, volume: this.volume }; }
  subscribe(listener: () => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
  private changed() { this.listeners.forEach(listener => listener()); }
  private graph() {
    if (this.context) return this.context;
    const Constructor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!Constructor) return null;
    const context = this.context = new Constructor();
    this.master = context.createGain(); this.music = context.createGain(); this.effects = context.createGain();
    this.ui = context.createGain(); this.ambience = context.createGain();
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -10; limiter.knee.value = 12; limiter.ratio.value = 6;
    limiter.attack.value = .008; limiter.release.value = .25;
    this.master.gain.value = this.muted ? 0 : dbGain(-4);
    this.music.gain.value = this.musicEnabled ? dbGain(-15) : 0;
    this.ambience.gain.value = this.ambienceEnabled ? dbGain(-20) : 0;
    this.effects.gain.value = this.volume === 0 ? 0 : dbGain(-28 + this.volume * 28);
    this.ui.gain.value = this.effects.gain.value * .7;
    for (const bus of [this.music,this.effects,this.ui,this.ambience]) bus.connect(this.master);
    this.master.connect(limiter); limiter.connect(context.destination);
    return context;
  }
  initFromGesture() {
    const context = this.graph(); if (!context || document.hidden) return;
    if (context.state === 'suspended') void context.resume().then(()=>this.startBackground()).catch(()=>{});
    else this.startBackground();
  }
  setScene(scene: 'lobby' | 'playing') { this.playing=scene==='playing'; }
  private startBackground() { if (!this.muted) { this.startMusic(); this.startAmbience(); } }
  private tone(frequency: number, duration: number, gain: number, type: OscillatorType, bus: GainNode, delay = 0, bend?: number) {
    if (!this.context) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator(), envelope = this.context.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency,start);
    if (bend) oscillator.frequency.exponentialRampToValueAtTime(bend,start+duration*.8);
    envelope.gain.setValueAtTime(.0001,start);
    envelope.gain.exponentialRampToValueAtTime(gain,start+.012);
    envelope.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(envelope); envelope.connect(bus);
    oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();};
    oscillator.start(start); oscillator.stop(start+duration+.02);
  }
  private noise(duration: number, delay: number, frequency: number, gain: number) {
    if (!this.context || !this.effects) return;
    const context=this.context, buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);
    const source=context.createBufferSource(), filter=context.createBiquadFilter(), envelope=context.createGain();
    source.buffer=buffer; filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.8;envelope.gain.value=gain;
    source.connect(filter);filter.connect(envelope);envelope.connect(this.effects);
    source.onended=()=>{source.disconnect();filter.disconnect();envelope.disconnect();};
    source.start(context.currentTime+delay);
  }
  private rattle() { for(let i=0;i<8;i++)this.noise(.05,i*.038,1000+Math.random()*1200,.32-i*.018); }
  startMusic() {
    if(this.musicTimer || !this.context || !this.music || !this.musicEnabled || this.muted || document.hidden)return;
    this.nextBeat=this.context.currentTime+.03;
    const schedule=()=>{
      if(!this.context || !this.music)return;
      // Look ahead on the audio clock: browser frame rate cannot change the tempo.
      while(this.nextBeat<this.context.currentTime+.16){
        const delay=Math.max(0,this.nextBeat-this.context.currentTime), step=this.step++;
        const chord=CHORDS[Math.floor(step/8)%4], melody=MELODY[step%MELODY.length];
        if(step%8===0)chord.forEach(note=>this.tone(note,.95,.08,'sine',this.music!,delay));
        if(step%4===0)this.tone(chord[0]/2,.48,.16,'sine',this.music,delay);
        if(melody && (this.playing || step%2===0)){
          this.tone(melody,.32,.15,'sine',this.music,delay);
          this.tone(melody*2,.13,.035,'triangle',this.music,delay);
        }
        if(this.playing && step%2===1)this.tone(chord[(step/2|0)%3]*2,.15,.035,'triangle',this.music,delay);
        this.nextBeat+=.3125; // gentle 96 BPM, eighth notes
      }
    };
    schedule();this.musicTimer=setInterval(schedule,80);
  }
  stopMusic() { if(this.musicTimer)clearInterval(this.musicTimer);this.musicTimer=null; }
  private startAmbience() {
    if(this.ambienceTimer || !this.context || !this.ambience || !this.ambienceEnabled || this.muted || document.hidden)return;
    const context=this.context, buffer=context.createBuffer(1,context.sampleRate*3,context.sampleRate), data=buffer.getChannelData(0);
    let previous=0;
    for(let i=0;i<data.length;i++){previous=(previous+(Math.random()*2-1)*.02)/1.02;data[i]=previous*2;}
    const source=context.createBufferSource(), filter=context.createBiquadFilter();
    source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=600;
    source.connect(filter);filter.connect(this.ambience);source.start();this.wind=source;
    source.onended=()=>{source.disconnect();filter.disconnect();};
    const chirp=()=>{if(!this.ambience || !this.context || this.muted)return;const base=1800+Math.random()*600;
      for(let i=0;i<3;i++)this.tone(base+i*120,.12,.11,'sine',this.ambience,i*.17,base*1.35);
    };
    this.ambienceTimer=setInterval(chirp,9500);
  }
  private stopAmbience() { if(this.ambienceTimer)clearInterval(this.ambienceTimer);this.ambienceTimer=null;this.wind?.stop();this.wind=null; }
  setMuted(value: boolean) {
    this.muted=value;localStorage.setItem('monopoly-cat-audio-muted',String(value));
    this.master?.gain.setTargetAtTime(value?0:dbGain(-4),this.context?.currentTime??0,.04);
    if(value){this.stopMusic();this.stopAmbience();}else this.initFromGesture();this.changed();
  }
  toggleMuted() { this.setMuted(!this.muted); }
  setMusic(value: boolean) {
    this.musicEnabled=value;localStorage.setItem('monopoly-music-enabled',String(value));
    this.music?.gain.cancelScheduledValues(this.context?.currentTime??0);
    this.music?.gain.setTargetAtTime(value?dbGain(-15):0,this.context?.currentTime??0,.12);
    if(value)this.initFromGesture();else this.stopMusic();this.changed();
  }
  setAmbience(value: boolean) {
    this.ambienceEnabled=value;localStorage.setItem('monopoly-ambience-enabled',String(value));
    this.ambience?.gain.setTargetAtTime(value?dbGain(-20):0,this.context?.currentTime??0,.1);
    if(value)this.initFromGesture();else this.stopAmbience();this.changed();
  }
  setVolume(value: number) {
    this.volume=Math.max(0,Math.min(1,value));localStorage.setItem('monopoly-sfx-volume',String(this.volume));
    const gain=this.volume===0?0:dbGain(-28+this.volume*28);
    this.effects?.gain.setTargetAtTime(gain,this.context?.currentTime??0,.04);
    this.ui?.gain.setTargetAtTime(gain*.7,this.context?.currentTime??0,.04);this.changed();
  }
  playSfx(name: SoundName) {
    const context=this.graph();if(!context || this.muted || !this.effects || context.state!=='running')return;
    if(name==='uiClick' && performance.now()-this.lastClick<70)return;
    if(name==='uiClick')this.lastClick=performance.now();
    // Only prominent events duck the music; repeated steps never cause pumping.
    if(this.music && this.musicEnabled && !['stepHop','uiClick','zoomAction'].includes(name) && context.currentTime-this.lastDuck>.3){
      this.lastDuck=context.currentTime;this.music.gain.cancelScheduledValues(context.currentTime);
      this.music.gain.setTargetAtTime(dbGain(-23),context.currentTime,.04);
      this.music.gain.setTargetAtTime(dbGain(-15),context.currentTime+.65,.25);
    }
    const bus=name==='uiClick'||name==='zoomAction'?this.ui!:this.effects, jitter=1+(Math.random()-.5)*.08;
    const notes=(frequencies:number[],duration=.25)=>frequencies.forEach((f,i)=>{
      this.tone(f*jitter,duration,.2,'sine',bus,i*.075);this.tone(f*2*jitter,duration*.45,.035,'triangle',bus,i*.075);
    });
    switch(name){
      case 'uiClick':this.tone(660*jitter,.055,.1,'sine',bus,0,480*jitter);break;
      case 'diceShake':this.rattle();break;
      case 'diceRoll':this.rattle();this.noise(.09,.3,420,.35);this.tone(155,.13,.2,'sine',bus,.32,90);break;
      case 'stepHop':this.tone(210*jitter,.07,.13,'sine',bus,0,125*jitter);this.noise(.025,0,650,.11);break;
      case 'land':this.tone(240,.15,.16,'sine',bus,0,120);notes([784,1046],.18);break;
      case 'coinGain':notes([1046,1318,1568]);break;
      case 'coinLoss':notes([440,349,294]);break;
      case 'purchase':notes([523,659,784,1046],.42);break;
      case 'build':this.noise(.06,0,450,.22);notes([392,523,784,1046],.32);break;
      case 'fortune':case 'roomReady':notes([659,784,987,1318],.34);break;
      case 'turnEnd':notes([392,523,659],.2);break;
      case 'zoomAction':this.tone(440,.065,.065,'sine',bus,0,660);break;
    }
  }
}
export const gameAudio = new GameAudioManager();
if(import.meta.hot)import.meta.hot.dispose(()=>gameAudio.dispose());
