import React from 'react';
import { Collection } from '../types';
import softWhiteWaveBg from '../assets/images/soft_white_3d_wave_bg_1790171220020.jpg';

interface ContinuousBackgroundProps {
  collection: Collection;
  blurOverride?: number;
  bgImageUrl?: string;
}

export const ContinuousBackground: React.FC<ContinuousBackgroundProps> = ({
  collection,
  bgImageUrl,
}) => {
  const activeBg = bgImageUrl || softWhiteWaveBg;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-white select-none">
      {/* 1. Base Pristine White Canvas */}
      <div className="absolute inset-0 bg-[#ffffff]" />

      {/* 2. Soft Architectural Wave Texture (high brightness, soft blend into pure white) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-45 mix-blend-multiply transition-all duration-1000"
        style={{
          backgroundImage: `url(${activeBg})`,
          filter: 'contrast(1.02) brightness(1.18) saturate(0.9)',
        }}
      />

      {/* 3. Soft Pastel Gradients: Flowing Dreamy Color Halos */}
      {/* Top Left: Soft Pastel Peach / Apricot Aura */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] rounded-full filter blur-[130px] opacity-60 animate-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 228, 214, 0.85) 0%, rgba(255, 245, 238, 0.5) 45%, rgba(255, 255, 255, 0) 75%)',
          animationDuration: '14s',
        }}
      />

      {/* Top Right: Soft Pastel Lavender & Lilac Veil */}
      <div
        className="absolute -top-[10%] -right-[12%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full filter blur-[140px] opacity-55 animate-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(243, 229, 245, 0.85) 0%, rgba(248, 238, 255, 0.45) 50%, rgba(255, 255, 255, 0) 75%)',
          animationDuration: '16s',
        }}
      />

      {/* Center Ambient: Delicate Soft Pastel Powder Blue / Mint Whisper */}
      <div
        className="absolute top-[35%] left-[20%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full filter blur-[150px] opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(227, 242, 253, 0.7) 0%, rgba(238, 247, 255, 0.35) 50%, rgba(255, 255, 255, 0) 75%)',
        }}
      />

      {/* Bottom Center / Right: Soft Warm Champagne & Pastel Blush Glow */}
      <div
        className="absolute -bottom-[15%] right-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full filter blur-[140px] opacity-55 animate-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 236, 224, 0.8) 0%, rgba(255, 240, 245, 0.5) 45%, rgba(255, 255, 255, 0) 75%)',
          animationDuration: '18s',
        }}
      />

      {/* 4. Elegant Organic Curved Wave Ribbons with Pastel Shimmer */}
      <div className="absolute inset-0 w-full h-full opacity-60">
        <svg
          className="absolute w-full h-full object-cover"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="softPastelShadow1" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="20" stdDeviation="30" floodColor="#d8b4a6" floodOpacity="0.08" />
            </filter>
            <filter id="softPastelShadow2" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="30" stdDeviation="40" floodColor="#b8a7cb" floodOpacity="0.07" />
            </filter>

            {/* Wave 1: Clean White into Soft Warm Pastel Blush */}
            <linearGradient id="pastelWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#fff2eb" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#faece8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>

            {/* Wave 2: Pastel Peach into Delicate Soft Lilac */}
            <linearGradient id="pastelWave2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#f7edf9" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#fdf0ea" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
            </linearGradient>

            {/* Wave 3: Foreground Ultra-Soft Luminous White Ribbon */}
            <linearGradient id="pastelWave3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#fcf6f2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Upper Graceful Arch Wave */}
          <path
            d="M-50,220 C320,110 540,460 950,260 C1250,130 1380,300 1520,230 L1520,950 L-50,950 Z"
            fill="url(#pastelWave1)"
            filter="url(#softPastelShadow1)"
          />

          {/* Middle Flowing Pastel Wave */}
          <path
            d="M-80,480 C260,370 620,660 1080,440 C1320,340 1440,490 1520,420 L1520,950 L-80,950 Z"
            fill="url(#pastelWave2)"
            filter="url(#softPastelShadow2)"
          />

          {/* Foreground Soft Swell */}
          <path
            d="M-40,680 C360,610 720,770 1140,640 C1360,580 1460,680 1520,620 L1520,950 L-40,950 Z"
            fill="url(#pastelWave3)"
          />
        </svg>
      </div>

      {/* 5. Pure Clean White Fade Vignette at Top and Edges to Keep Typography Crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/40 pointer-events-none" />
    </div>
  );
};
