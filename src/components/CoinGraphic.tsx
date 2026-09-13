import React from "react";

interface CoinGraphicProps {
  className?: string;
  size?: number;
}

export default function CoinGraphic({ className = "", size = 24 }: CoinGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] transition-transform duration-300 hover:scale-110 select-none ${className}`}
    >
      <defs>
        <radialGradient id="coinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <linearGradient id="coinRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="coinFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Outer Glow Ring */}
      <circle cx="20" cy="20" r="19" fill="url(#coinGlow)" opacity="0.25" />
      {/* Outer Metallic Rim */}
      <circle cx="20" cy="20" r="17" fill="url(#coinRim)" stroke="#fef08a" strokeWidth="1" />
      {/* Ribbed Ridge Inner Ring */}
      <circle cx="20" cy="20" r="14.5" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="2,1.5" />
      {/* Inner Coin Face */}
      <circle cx="20" cy="20" r="13" fill="url(#coinFace)" stroke="#fef08a" strokeWidth="1" />
      {/* Specular Light Reflection Arc */}
      <path d="M 10 13 A 11 11 0 0 1 30 13" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Center Star & M Symbol */}
      <polygon points="20,11 22.5,16 28,16.5 24,20.5 25.5,26 20,23 14.5,26 16,20.5 12,16.5 17.5,16" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
    </svg>
  );
}
