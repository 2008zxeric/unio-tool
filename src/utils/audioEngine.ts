class AudioEngine {
  private ctx: AudioContext | null = null;
  private currentSourceNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    noiseNode?: AudioNode;
  } | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.1);
    }
  }

  public start432HzDrone() {
    this.playTrack("drone_432");
  }

  public stop432HzDrone() {
    this.stopTrack();
  }

  // Play continuous healing soundscape
  public playTrack(pattern: "drone_432" | "singing_bowl" | "pine_rain" | "zen_stream") {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopTrack();
    this.isPlaying = true;

    if (pattern === "drone_432") {
      this.play432Drone();
    } else if (pattern === "singing_bowl") {
      this.playSingingBowlLoop();
    } else if (pattern === "pine_rain") {
      this.playRainBreeze();
    } else if (pattern === "zen_stream") {
      this.playZenStream();
    }
  }

  private play432Drone() {
    if (!this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    const gain3 = this.ctx.createGain();

    // 432Hz Fundamental + Sub-harmonic + Octave
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(432, this.ctx.currentTime);
    gain1.gain.setValueAtTime(0.25, this.ctx.currentTime);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(216, this.ctx.currentTime); // 1 octave down
    gain2.gain.setValueAtTime(0.35, this.ctx.currentTime);

    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(108, this.ctx.currentTime); // deep warmth
    gain3.gain.setValueAtTime(0.15, this.ctx.currentTime);

    // Lowpass filter for smooth organic warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(filter);
    gain2.connect(filter);
    gain3.connect(filter);
    filter.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();

    this.currentSourceNodes = {
      oscillators: [osc1, osc2, osc3],
      gains: [gain1, gain2, gain3]
    };
  }

  private playSingingBowlLoop() {
    if (!this.ctx || !this.masterGain) return;
    // Periodic singing bowl strike
    const triggerStrike = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      this.strikeSingingBowl(528);
    };

    triggerStrike();
    const interval = window.setInterval(triggerStrike, 6000);

    this.currentSourceNodes = {
      oscillators: [],
      gains: [],
      noiseNode: {
        disconnect: () => clearInterval(interval)
      } as any
    };
  }

  public strikeSingingBowl(freq = 528) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const freqs = [freq, freq * 2.76, freq * 5.4, freq * 8.9];
    const amps = [0.4, 0.2, 0.1, 0.04];

    freqs.forEach((f, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);

      // Natural bowl amplitude envelope
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(amps[i], t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 5.6);
    });
  }

  private playRainBreeze() {
    if (!this.ctx || !this.masterGain) return;
    // Generate pink-noise rain buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.06;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();

    this.currentSourceNodes = {
      oscillators: [],
      gains: [gain],
      noiseNode: whiteNoise
    };
  }

  private playZenStream() {
    if (!this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(639, this.ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, this.ctx.currentTime);

    // Filtered water-like soft stream
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1200, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(2.0, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc1.start();
    noiseSource.start();

    this.currentSourceNodes = {
      oscillators: [osc1],
      gains: [gain1, noiseGain],
      noiseNode: noiseSource
    };
  }

  public stopTrack() {
    this.isPlaying = false;
    if (this.currentSourceNodes) {
      this.currentSourceNodes.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      if (this.currentSourceNodes.noiseNode) {
        try {
          (this.currentSourceNodes.noiseNode as any).stop?.();
          this.currentSourceNodes.noiseNode.disconnect();
        } catch (e) {}
      }
      this.currentSourceNodes.gains.forEach(g => {
        try {
          g.disconnect();
        } catch (e) {}
      });
      this.currentSourceNodes = null;
    }
  }

  // Play crisp essential oil droplet haptic sound
  public playDropletSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    // Pitch envelope: quick drop from 1800Hz to 600Hz
    osc.frequency.setValueAtTime(1900, t);
    osc.frequency.exponentialRampToValueAtTime(750, t + 0.08);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.13);

    // Mobile vibration if supported
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch (e) {}
    }
  }

  // Play breath guidance bell chime
  public playBreathChime(type: "inhale" | "hold" | "exhale") {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freqMap = {
      inhale: 528,
      hold: 432,
      exhale: 396
    };

    osc.type = "sine";
    osc.frequency.setValueAtTime(freqMap[type], t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.9);

    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(type === "inhale" ? [20, 50, 20] : 30);
      } catch (e) {}
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
