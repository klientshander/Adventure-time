import { Track } from './types';

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private synthInterval: any = null;
  private customAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private volume = 0.75;
  private isMuted = false;
  private onTimeUpdateCallback: ((currentTime: number, duration: number) => void) | null = null;
  private onTrackEndCallback: (() => void) | null = null;
  private onPopBeatCallback: (() => void) | null = null;
  private currentTrack: Track | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.customAudio = new Audio();
      this.customAudio.addEventListener('timeupdate', () => {
        if (!this.customAudio) return;
        const cur = this.customAudio.currentTime;
        const dur = this.customAudio.duration || (this.currentTrack?.duration ?? 108);
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(cur, isNaN(dur) ? 108 : dur);
        }
      });
      this.customAudio.addEventListener('ended', () => {
        if (this.onTrackEndCallback) {
          this.onTrackEndCallback();
        }
      });
    }
  }

  public init() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.analyserNode = this.audioCtx.createAnalyser();
        this.analyserNode.fftSize = 32;
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.gainNode.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setCallbacks(
    onTimeUpdate: (currentTime: number, duration: number) => void,
    onTrackEnd: () => void,
    onPopBeat: () => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onTrackEndCallback = onTrackEnd;
    this.onPopBeatCallback = onPopBeat;
  }

  public playPopSound() {
    this.init();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const g = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(460, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.08);

    g.gain.setValueAtTime(this.volume * 0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(g);
    g.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.085);
  }

  public loadTrack(track: Track, autoPlay: boolean) {
    this.currentTrack = track;
    this.stopSynth();

    if (this.customAudio) {
      this.customAudio.pause();
      if (track.audioSrc) {
        this.customAudio.src = track.audioSrc;
        this.customAudio.load();
      } else if (!track.isCustom) {
        this.customAudio.src = '';
      }
    }

    if (autoPlay) {
      this.play();
    } else {
      this.pause();
    }
  }

  public setCustomAudioUrl(url: string) {
    if (this.customAudio) {
      this.customAudio.src = url;
      this.customAudio.load();
    }
  }

  public play() {
    this.init();
    this.isPlaying = true;

    if (!this.currentTrack) return;

    if (this.currentTrack.audioSrc || (this.currentTrack.isCustom && this.customAudio?.src)) {
      this.stopSynth();
      if (this.customAudio) {
        this.customAudio.play().catch(() => {});
      }
    } else {
      if (this.customAudio) {
        this.customAudio.pause();
      }
      this.startSynth(this.currentTrack);
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopSynth();
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public seek(seconds: number) {
    if (!this.currentTrack) return;
    if ((this.currentTrack.audioSrc || this.currentTrack.isCustom) && this.customAudio) {
      this.customAudio.currentTime = seconds;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    this.isMuted = false;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    const targetVol = this.isMuted ? 0 : this.volume;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(targetVol, this.audioCtx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = targetVol;
    }
    return this.isMuted;
  }

  private startSynth(track: Track) {
    this.stopSynth();
    if (!this.audioCtx || !track.scale || !track.bassPattern || !track.arpPattern) return;

    const bpm = track.bpm || 120;
    const intervalMs = (60 / bpm / 2) * 1000;
    let step = 0;

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx || !this.gainNode || !this.analyserNode) return;

      const t = this.audioCtx.currentTime;

      // Popcat beat trigger
      if (track.isPopcatTrack && step % 2 === 0) {
        if (this.onPopBeatCallback) {
          this.onPopBeatCallback();
        }
      }

      // Melody Lead
      const noteIdx = track.arpPattern![step % track.arpPattern!.length];
      const freq = track.scale![noteIdx % track.scale!.length];

      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      noteGain.gain.setValueAtTime(0.12, t);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(noteGain);
      noteGain.connect(this.analyserNode);
      noteGain.connect(this.gainNode);

      osc.start(t);
      osc.stop(t + 0.24);

      // Bassline
      if (step % 4 === 0) {
        const bassOsc = this.audioCtx.createOscillator();
        const bassGain = this.audioCtx.createGain();
        const bassFreq = track.bassPattern![(Math.floor(step / 4)) % track.bassPattern!.length];
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, t);

        bassGain.gain.setValueAtTime(0.18, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        bassOsc.connect(bassGain);
        bassGain.connect(this.analyserNode);
        bassGain.connect(this.gainNode);

        bassOsc.start(t);
        bassOsc.stop(t + 0.38);
      }

      // Snare / Noise burst
      if (step % 8 === 4) {
        const bufferSize = this.audioCtx.sampleRate * 0.05;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.07, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        noise.connect(noiseGain);
        noiseGain.connect(this.analyserNode);
        noiseGain.connect(this.gainNode);

        noise.start(t);
      }

      step++;
    }, intervalMs);
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public destroy() {
    this.stopSynth();
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
    }
  }
}

