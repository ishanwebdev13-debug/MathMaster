import React from "react";

interface PackArtworkProps {
  packId: string;
  className?: string;
}

export default function PackArtwork({ packId, className = "" }: PackArtworkProps) {
  return (
    <div className={`relative w-24 h-24 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* --- AQUATIC PACK ARTWORK --- */}
        {packId === "aquatic" && (
          <g>
            <circle cx="50" cy="50" r="42" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
            <path d="M 15 50 Q 50 15 85 50 Q 50 85 15 50 Z" fill="#06b6d4" opacity="0.6" />
            {/* Ocean Waves Crest */}
            <path d="M 25 55 Q 35 30 50 45 Q 65 30 75 55 Q 50 75 25 55 Z" fill="#22d3ee" stroke="#ffffff" strokeWidth="2" />
            <path d="M 50 20 L 50 35 M 30 30 L 40 40 M 70 30 L 60 40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* --- VOLCANIC PACK ARTWORK --- */}
        {packId === "volcanic" && (
          <g>
            <polygon points="50,8 90,88 10,88" fill="#7f1d1d" stroke="#f97316" strokeWidth="3" />
            <polygon points="50,22 80,82 20,82" fill="#ea580c" />
            {/* Erupting Magma Flare */}
            <polygon points="50,22 40,50 60,50" fill="#fef08a" />
            <circle cx="50" cy="18" r="6" fill="#fef08a" />
            <path d="M 30 75 L 70 75 M 35 60 L 65 60" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* --- CELESTIAL PACK ARTWORK --- */}
        {packId === "celestial" && (
          <g>
            <circle cx="50" cy="50" r="42" fill="#312e81" stroke="#c084fc" strokeWidth="3" />
            {/* Orbital Rings */}
            <ellipse cx="50" cy="50" rx="46" ry="16" fill="none" stroke="#67e8f9" strokeWidth="2.5" transform="rotate(-25 50 50)" />
            {/* Shining Star Core */}
            <polygon points="50,18 56,38 76,44 58,54 62,74 50,60 38,74 42,54 24,44 44,38" fill="#fef08a" stroke="#ffffff" strokeWidth="1" />
          </g>
        )}

        {/* --- ANCIENT WILDS PACK ARTWORK --- */}
        {packId === "wilds" && (
          <g>
            <circle cx="50" cy="50" r="42" fill="#14532d" stroke="#4ade80" strokeWidth="3" />
            {/* Primordial Horns & Leaves */}
            <path d="M 25 65 Q 15 25 35 20 Q 45 40 42 68 Z" fill="#78350f" stroke="#86efac" strokeWidth="1.5" />
            <path d="M 75 65 Q 85 25 65 20 Q 55 40 58 68 Z" fill="#78350f" stroke="#86efac" strokeWidth="1.5" />
            {/* Emerald Leaf Gem */}
            <path d="M 50 30 Q 70 55 50 80 Q 30 55 50 30 Z" fill="#22c55e" stroke="#ffffff" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}
