/**
 * Brand Shop Professional Showroom Audio Engine
 * Supports real MP3/WAV audio files, volume control, autoplay detection,
 * and high-fidelity ambient Web Audio chime fallback if no external file is provided.
 */

class ShowroomAudioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isSynthesizing = false;

  public async playWelcomeAudio(
    audioUrl?: string,
    volume = 0.75,
    speechScript?: string
  ): Promise<{ started: boolean; autoplayBlocked: boolean }> {
    // If real audio file is specified
    if (audioUrl && audioUrl.trim().length > 0) {
      try {
        if (!this.audioEl) {
          this.audioEl = new Audio();
          this.audioEl.crossOrigin = 'anonymous';
        }
        this.audioEl.src = audioUrl;
        this.audioEl.volume = Math.max(0, Math.min(1, volume));
        await this.audioEl.play();
        return { started: true, autoplayBlocked: false };
      } catch (err) {
        console.warn('Audio autoplay blocked or failed to load:', err);
        return { started: false, autoplayBlocked: true };
      }
    }

    // High-end ambient soundscape fallback using Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.playLuxuryChime(this.audioCtx, volume);

      // Optionally speak welcome message if supported
      if (speechScript && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speechScript);
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        utterance.volume = Math.max(0, Math.min(1, volume));
        // Try to pick a polished English voice
        const voices = window.speechSynthesis.getVoices();
        const refinedVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Serena') || v.name.includes('Karen') || v.name.includes('Samantha') || v.name.includes('Google'))
        );
        if (refinedVoice) {
          utterance.voice = refinedVoice;
        }
        window.speechSynthesis.speak(utterance);
      }

      return { started: true, autoplayBlocked: false };
    } catch {
      return { started: false, autoplayBlocked: true };
    }
  }

  private playLuxuryChime(ctx: AudioContext, volume: number) {
    const now = ctx.currentTime;
    // Luxury chord: F#m9 / Dmaj9 subtle acoustic shimmer
    const freqs = [220, 277.18, 329.63, 415.3, 554.37, 659.25];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 4.5);

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      const delay = idx * 0.12;
      const initialGain = (0.15 / freqs.length) * volume;

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(initialGain, now + delay + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + delay + 4.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 5.0);
    });
  }

  public stop() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setVolume(vol: number) {
    if (this.audioEl) {
      this.audioEl.volume = Math.max(0, Math.min(1, vol));
    }
  }
}

export const showroomAudio = new ShowroomAudioEngine();
