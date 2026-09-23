import React, { useEffect, useState, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import { showroomAudio } from '../utils/audioSynthesizer';
import { Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeIntroProps {
  onEnterShowroom: () => void;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onEnterShowroom }) => {
  const { data } = useCms();
  const { welcomeIntro, welcomeAudio } = data;

  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Attempt autoplay audio on mount
  useEffect(() => {
    if (!welcomeAudio.isEnabled) return;

    const startAudio = async () => {
      const result = await showroomAudio.playWelcomeAudio(
        welcomeAudio.audioUrl,
        welcomeAudio.volume,
        welcomeAudio.welcomeMessageText
      );

      if (result.started) {
        setIsPlayingAudio(true);
        setIsAutoplayBlocked(false);
      } else if (result.autoplayBlocked) {
        setIsAutoplayBlocked(true);
      }
    };

    startAudio();

    // Progress bar for auto-advance if configured
    const totalDuration = welcomeIntro.durationSeconds * 1000;
    const intervalTime = 50;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);
    }, intervalTime);

    // Auto transition to main showroom after duration
    timerRef.current = setTimeout(() => {
      handleExit();
    }, totalDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [welcomeIntro.durationSeconds, welcomeAudio.isEnabled, welcomeAudio.audioUrl, welcomeAudio.volume, welcomeAudio.welcomeMessageText]);

  const handleManualStart = async () => {
    setIsAutoplayBlocked(false);
    if (welcomeAudio.isEnabled) {
      await showroomAudio.playWelcomeAudio(
        welcomeAudio.audioUrl,
        welcomeAudio.volume,
        welcomeAudio.welcomeMessageText
      );
      setIsPlayingAudio(true);
    }
  };

  const handleExit = () => {
    setIsTransitioningOut(true);
    // Smooth cinematic zoom and dissolve out
    setTimeout(() => {
      onEnterShowroom();
    }, 900);
  };

  const toggleMute = () => {
    if (isPlayingAudio) {
      showroomAudio.stop();
      setIsPlayingAudio(false);
    } else {
      handleManualStart();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 w-full h-full bg-[#faf9f6] overflow-hidden flex flex-col justify-between select-none transition-all duration-1000 ease-out ${
        isTransitioningOut
          ? 'opacity-0 scale-105 filter blur-sm pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Intro Background with Custom Upload Support */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        {/* Soft atmospheric gradient mesh */}
        <div className="absolute inset-0 bg-[#faf9f6]" />

        {/* Dynamic Admin-Configured Background Image Layer */}
        {welcomeIntro.bgImageUrl && (
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-[12000ms] ease-out scale-100 animate-kenburns"
            style={{
              backgroundImage: `url(${welcomeIntro.bgImageUrl})`,
              filter: `blur(${welcomeIntro.bgBlur ?? 12}px) brightness(1.04)`,
              opacity: welcomeIntro.bgOpacity ?? 0.85,
              transform: 'scale(1.06)',
            }}
          />
        )}

        {/* Aesthetic Overlay Style */}
        {welcomeIntro.bgOverlayStyle === 'vignette' && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35 pointer-events-none" />
        )}
        {(!welcomeIntro.bgOverlayStyle || welcomeIntro.bgOverlayStyle === 'glow') && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-white/10 pointer-events-none mix-blend-screen" />
        )}

        {/* Ambient Top & Bottom Light Wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/40 pointer-events-none" />
      </div>

      {/* 3D Realistic Fashion Model Presentation Layer */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center lg:justify-end lg:pr-24 pointer-events-none">
        <div className="relative h-[85vh] max-h-[860px] aspect-[9/16] transition-all duration-[8000ms] ease-out transform translate-y-2 animate-subtle-float">
          <img
            src={welcomeIntro.modelImageUrl}
            alt="Brand Shop Western Atelier Model"
            className="w-full h-full object-cover object-top rounded-2xl shadow-2xl opacity-95 brightness-100 contrast-105 drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] border border-neutral-200/60"
          />
          {/* Subtle directional studio rim light gradient over model */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6]/90 via-transparent to-transparent opacity-60" />
        </div>
      </div>

      {/* Top Bar / Minimal Brand Lockup */}
      <header className="relative z-20 flex items-center justify-between px-8 md:px-16 py-8">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-800 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-600 font-semibold">
            Virtual Atelier Entry
          </span>
        </div>

        {/* Audio Mute / Unmute Control */}
        <div className="flex items-center gap-4">
          {welcomeAudio.isEnabled && (
            <button
              onClick={toggleMute}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 text-xs tracking-wider transition-colors cursor-pointer shadow-xs"
              title={isPlayingAudio ? 'Mute showroom audio' : 'Play showroom audio'}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                  <span className="hidden sm:inline font-medium">Audio Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline font-medium">Audio Muted</span>
                </>
              )}
            </button>
          )}

          {/* Quick Skip Button */}
          <button
            onClick={handleExit}
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs tracking-widest uppercase font-semibold transition-all duration-200 cursor-pointer shadow-sm"
          >
            Enter Showroom
          </button>
        </div>
      </header>

      {/* Hero Welcome Typography (Apple Minimal + High-Fashion Editorial) */}
      <main className="relative z-20 px-8 md:px-16 lg:px-24 my-auto max-w-2xl">
        <div className="space-y-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-neutral-200 text-amber-800 font-semibold text-xs tracking-[0.3em] uppercase shadow-xs">
            {welcomeIntro.brandTitle}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light tracking-tight text-neutral-900 leading-none">
            {welcomeIntro.brandName}
          </h1>

          <p className="text-sm md:text-base font-light tracking-[0.25em] uppercase text-neutral-700 pt-1">
            {welcomeIntro.brandSubtitle}
          </p>

          <div className="w-16 h-[2px] bg-amber-800/40 my-6" />

          <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed max-w-lg">
            Experience our 2-floor digital fashion showroom: 1st Floor – Baby & Kids and 2nd Floor – Women’s Collection, presented in high-resolution couture photography.
          </p>
        </div>

        {/* Autoplay blocked manual play action */}
        {isAutoplayBlocked && (
          <div className="mt-8 pt-2">
            <button
              onClick={handleManualStart}
              className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-neutral-900 text-white font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{welcomeAudio.fallbackButtonText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </main>

      {/* Footer Navigation Indicator & Auto-Progress Bar */}
      <footer className="relative z-20 px-8 md:px-16 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-neutral-600 tracking-widest uppercase font-medium">
          <span>Level 1 · Baby & Kids</span>
          <span className="text-neutral-400">/</span>
          <span>Level 2 · Women’s Collection</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 h-[3px] bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
      </footer>
    </div>
  );
};
