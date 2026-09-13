import React from "react";

export type AvatarId =
  | "dragon_master"
  | "astral_wizard"
  | "phoenix_paladin"
  | "cyber_alchemist"
  | "ocean_titan"
  | "forest_druid"
  | "shadow_assassin"
  | "solar_monarch";

export interface AvatarOption {
  id: AvatarId;
  name: string;
  title: string;
  color: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "dragon_master", name: "Dragon Knight", title: "Master of Flames", color: "#f97316" },
  { id: "astral_wizard", name: "Astral Wizard", title: "Cosmic Archmage", color: "#a855f7" },
  { id: "phoenix_paladin", name: "Phoenix Paladin", title: "Sun Knight", color: "#eab308" },
  { id: "cyber_alchemist", name: "Cyber Alchemist", title: "Tech Sage", color: "#06b6d4" },
  { id: "ocean_titan", name: "Ocean Titan", title: "Abyssal Lord", color: "#38bdf8" },
  { id: "forest_druid", name: "Forest Druid", title: "Wilds Guardian", color: "#22c55e" },
  { id: "shadow_assassin", name: "Shadow Assassin", title: "Void Stalker", color: "#8b5cf6" },
  { id: "solar_monarch", name: "Solar Monarch", title: "Golden Ruler", color: "#f59e0b" },
];

interface UserAvatarProps {
  avatarId?: string;
  username?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function UserAvatar({
  avatarId = "dragon_master",
  username = "Hero",
  size = "md",
  className = "",
}: UserAvatarProps) {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
  }[size];

  // Map avatar ID or default to deterministically pick an avatar based on username hash if not set
  const validAvatarId: AvatarId = AVATAR_OPTIONS.some((a) => a.id === avatarId)
    ? (avatarId as AvatarId)
    : AVATAR_OPTIONS[Math.abs(hashString(username)) % AVATAR_OPTIONS.length].id;

  const currentOption = AVATAR_OPTIONS.find((a) => a.id === validAvatarId) || AVATAR_OPTIONS[0];

  return (
    <div
      className={`relative ${sizeMap} rounded-full overflow-hidden flex items-center justify-center select-none shadow-xl border-2 border-white/20 transition-transform hover:scale-105 ${className}`}
      style={{ backgroundColor: currentOption.color }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`avatarGlow_${validAvatarId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor={currentOption.color} stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Background Aura */}
        <circle cx="50" cy="50" r="48" fill={`url(#avatarGlow_${validAvatarId})`} />

        {/* --- 1. DRAGON KNIGHT --- */}
        {validAvatarId === "dragon_master" && (
          <g>
            {/* Horned Dragon Helmet */}
            <path d="M 25 45 Q 15 15 10 10 Q 25 25 35 38 Z" fill="#7f1d1d" stroke="#facc15" strokeWidth="1.5" />
            <path d="M 75 45 Q 85 15 90 10 Q 75 25 65 38 Z" fill="#7f1d1d" stroke="#facc15" strokeWidth="1.5" />
            <path d="M 30 40 Q 50 15 70 40 Q 75 70 50 85 Q 25 70 30 40 Z" fill="#18181b" stroke="#ea580c" strokeWidth="2.5" />
            {/* Visor Slit */}
            <path d="M 35 48 Q 50 42 65 48 L 50 54 Z" fill="#fef08a" stroke="#ef4444" strokeWidth="1" />
          </g>
        )}

        {/* --- 2. ASTRAL WIZARD --- */}
        {validAvatarId === "astral_wizard" && (
          <g>
            {/* Pointed Wizard Hood */}
            <path d="M 20 60 Q 50 10 80 60 Q 70 85 50 90 Q 30 85 20 60 Z" fill="#312e81" stroke="#c084fc" strokeWidth="2.5" />
            {/* Glowing Eyes */}
            <ellipse cx="40" cy="50" rx="4" ry="2" fill="#67e8f9" />
            <ellipse cx="60" cy="50" rx="4" ry="2" fill="#67e8f9" />
            {/* Forehead Star */}
            <polygon points="50,25 52,30 57,30 53,33 55,38 50,35 45,38 47,33 43,30 48,30" fill="#fef08a" />
          </g>
        )}

        {/* --- 3. PHOENIX PALADIN --- */}
        {validAvatarId === "phoenix_paladin" && (
          <g>
            {/* Golden Helm */}
            <path d="M 25 45 Q 50 12 75 45 Q 70 80 50 88 Q 30 80 25 45 Z" fill="#f59e0b" stroke="#fef08a" strokeWidth="2.5" />
            {/* Crown Crest */}
            <polygon points="50,12 42,28 58,28" fill="#ef4444" stroke="#facc15" strokeWidth="1" />
            {/* T-Visor */}
            <path d="M 35 42 L 65 42 M 50 42 L 50 65" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}

        {/* --- 4. CYBER ALCHEMIST --- */}
        {validAvatarId === "cyber_alchemist" && (
          <g>
            {/* Sci-Fi Collar & Mask */}
            <path d="M 25 50 Q 50 25 75 50 Q 80 85 50 92 Q 20 85 25 50 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
            {/* Glowing Cyber Visor Strip */}
            <rect x="30" y="42" width="40" height="10" rx="5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" />
            <line x1="30" y1="47" x2="70" y2="47" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}

        {/* --- 5. OCEAN TITAN --- */}
        {validAvatarId === "ocean_titan" && (
          <g>
            {/* Wave Crown Helm */}
            <path d="M 20 40 L 32 15 L 50 30 L 68 15 L 80 40 Q 75 80 50 88 Q 25 80 20 40 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Cyan Eyes */}
            <ellipse cx="40" cy="46" rx="5" ry="3" fill="#67e8f9" />
            <ellipse cx="60" cy="46" rx="5" ry="3" fill="#67e8f9" />
          </g>
        )}

        {/* --- 6. FOREST DRUID --- */}
        {validAvatarId === "forest_druid" && (
          <g>
            {/* Antler Crown */}
            <path d="M 35 30 Q 20 10 10 12 Q 25 20 30 35 Z" fill="#451a03" stroke="#86efac" strokeWidth="1" />
            <path d="M 65 30 Q 80 10 90 12 Q 75 20 70 35 Z" fill="#451a03" stroke="#86efac" strokeWidth="1" />
            {/* Druid Cowl */}
            <path d="M 25 45 Q 50 20 75 45 Q 70 85 50 90 Q 30 85 25 45 Z" fill="#14532d" stroke="#4ade80" strokeWidth="2.5" />
            <circle cx="42" cy="50" r="4" fill="#facc15" />
            <circle cx="58" cy="50" r="4" fill="#facc15" />
          </g>
        )}

        {/* --- 7. SHADOW ASSASSIN --- */}
        {validAvatarId === "shadow_assassin" && (
          <g>
            {/* Ninja Mask Hood */}
            <path d="M 25 50 Q 50 15 75 50 Q 70 88 50 92 Q 30 88 25 50 Z" fill="#18181b" stroke="#a855f7" strokeWidth="2.5" />
            {/* Eye Slit */}
            <path d="M 32 45 Q 50 40 68 45 L 68 53 Q 50 48 32 53 Z" fill="#581c87" />
            <circle cx="42" cy="48" r="3" fill="#c084fc" />
            <circle cx="58" cy="48" r="3" fill="#c084fc" />
          </g>
        )}

        {/* --- 8. SOLAR MONARCH --- */}
        {validAvatarId === "solar_monarch" && (
          <g>
            {/* Golden Sunburst Crown */}
            <polygon points="50,8 42,25 30,12 35,28 20,22 30,35 50,28 70,35 80,22 65,28 70,12 58,25" fill="#fef08a" />
            <path d="M 28 45 Q 50 22 72 45 Q 70 82 50 88 Q 30 82 28 45 Z" fill="#d97706" stroke="#fef08a" strokeWidth="2.5" />
            <circle cx="42" cy="48" r="4" fill="#ffffff" />
            <circle cx="58" cy="48" r="4" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  );
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
