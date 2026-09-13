import React from "react";
import type { BadgeTier } from "../lib/badges";

interface BadgeGraphicProps {
  tier?: BadgeTier;
  badgeId?: string;
  size?: number;
  className?: string;
}

export default function BadgeGraphic({
  tier = "common",
  badgeId,
  size = 48,
  className = "",
}: BadgeGraphicProps) {
  const isLegendary = tier === "legendary";
  const isEpic = tier === "epic";
  const isRare = tier === "rare";

  const mainColor = isLegendary
    ? "#eab308"
    : isEpic
    ? "#a855f7"
    : isRare
    ? "#3b82f6"
    : "#94a3b8";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110 select-none ${className}`}
    >
      <defs>
        <linearGradient id={`badgeRim_${tier}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isLegendary ? "#fef08a" : isEpic ? "#e9d5ff" : isRare ? "#93c5fd" : "#cbd5e1"} />
          <stop offset="50%" stopColor={mainColor} />
          <stop offset="100%" stopColor={isLegendary ? "#78350f" : isEpic ? "#3b0764" : isRare ? "#1e3a8a" : "#334155"} />
        </linearGradient>
      </defs>

      {/* Outer Shield Boundary */}
      <path
        d="M 30 5 L 52 15 C 52 38 40 50 30 55 C 20 50 8 38 8 15 Z"
        fill={`url(#badgeRim_${tier})`}
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      {/* Inner Metallic Shield Plate */}
      <path
        d="M 30 9 L 47 18 C 47 34 37 45 30 49 C 23 45 13 34 13 18 Z"
        fill="#0f172a"
        stroke={mainColor}
        strokeWidth="2"
      />

      {/* Shiny Crest Star / Emblem */}
      {isLegendary && (
        <polygon points="30,16 33,24 41,25 35,30 37,38 30,33 23,38 25,30 19,25 27,24" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
      )}
      {isEpic && (
        <polygon points="30,16 35,26 44,30 35,34 30,44 25,34 16,30 25,26" fill="#c084fc" stroke="#312e81" strokeWidth="0.8" />
      )}
      {isRare && (
        <circle cx="30" cy="30" r="10" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      )}
      {!isLegendary && !isEpic && !isRare && (
        <polygon points="30,18 38,36 22,36" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
      )}

      {/* Specular Highlight */}
      <path d="M 16 18 L 30 12 L 44 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
