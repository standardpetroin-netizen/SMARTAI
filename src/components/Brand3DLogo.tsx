import React, { useState, useRef } from 'react';

interface Brand3DLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
  dark?: boolean;
}

export const Brand3DLogo: React.FC<Brand3DLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
  dark = false
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / (rect.height / 2)) * 14,
      y: (x / (rect.width / 2)) * 14
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const dimensions = {
    sm: { box: 'w-8 h-8', icon: 32, text: 'text-lg', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', icon: 40, text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', icon: 56, text: 'text-2xl', sub: 'text-xs' }
  }[size];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 800 }}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
    >
      {/* 3D Geometric Isometric Emblem */}
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(10px)`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out'
        }}
        className={`relative ${dimensions.box} rounded-2xl p-0.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 shadow-lg shadow-indigo-600/30 shrink-0 flex items-center justify-center`}
      >
        {/* Animated Ambient Glow Ring */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 opacity-60 blur-xs group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />

        {/* Inner Emblem Canvas / SVG */}
        <div className="relative w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden border border-white/20">
          {/* Subtle Grid in Emblem */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px] opacity-30" />

          {/* SVG 3D Layered Isometric Towers */}
          <svg
            viewBox="0 0 48 48"
            className="w-full h-full p-1 relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="towerGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="towerGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
              <linearGradient id="towerGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
              <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Back Tower */}
            <path d="M28 8 L36 12 L36 32 L28 28 Z" fill="url(#towerGradRight)" opacity="0.8" />
            <path d="M20 12 L28 8 L28 28 L20 32 Z" fill="url(#towerGradLeft)" opacity="0.8" />
            <path d="M28 8 L36 12 L28 16 L20 12 Z" fill="url(#towerGradTop)" opacity="0.9" />

            {/* Front Tower (Main High-Rise) */}
            <path d="M24 16 L34 21 L34 42 L24 37 Z" fill="url(#towerGradRight)" />
            <path d="M14 21 L24 16 L24 37 L14 42 Z" fill="url(#towerGradLeft)" />
            <path d="M24 16 L34 21 L24 26 L14 21 Z" fill="url(#towerGradTop)" />

            {/* Architectural Grid Lines on Tower Face */}
            <line x1="16" y1="26" x2="22" y2="23" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
            <line x1="16" y1="31" x2="22" y2="28" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
            <line x1="16" y1="36" x2="22" y2="33" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />

            <line x1="26" y1="23" x2="32" y2="26" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
            <line x1="26" y1="28" x2="32" y2="31" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
            <line x1="26" y1="33" x2="32" y2="36" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />

            {/* Glowing 3D Orbit Ring with IoT Beacon */}
            <ellipse
              cx="24"
              cy="25"
              rx="18"
              ry="7"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              transform="rotate(-15 24 25)"
              className="animate-spin origin-center"
              style={{ animationDuration: '10s' }}
            />

            {/* Pulsing Beacon Sensor Sphere */}
            <circle cx="36" cy="20" r="2.2" fill="url(#orbGrad)" />
            <circle cx="36" cy="20" r="4" fill="#34d399" opacity="0.4" className="animate-ping" />
          </svg>
        </div>
      </div>

      {/* Brand Typographic Identity */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`${dimensions.text} font-black tracking-tight ${dark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600'} transition-colors leading-none`}>
              SmartAI<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent ml-0.5">Society</span>
            </span>
          </div>
          <span className={`${dimensions.sub} font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mt-0.5 font-mono flex items-center gap-1.5`}>
            <span>Smart Living OS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          </span>
        </div>
      )}
    </div>
  );
};
