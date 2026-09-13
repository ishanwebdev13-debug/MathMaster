import React from "react";
import { type Card, RARITY_CONFIG } from "../lib/cards";
import CardArtwork from "./CardArtwork";
import { IMAGE_CARDS } from "./CardArtwork";
import { Swords, Shield, Sparkles, Star } from "lucide-react";

interface GameCardProps {
  card: Card;
  count?: number;
  isNew?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export default function GameCard({
  card,
  count = 1,
  isNew = false,
  isLocked = false,
  onClick,
  size = "md",
}: GameCardProps) {
  const config = RARITY_CONFIG[card.rarity];
  const hasImage = IMAGE_CARDS.has(card.iconName);

  const sizeClasses = {
    sm: "w-44 h-64 text-xs",
    md: "w-56 h-84 text-sm",
    lg: "w-64 sm:w-72 h-[26rem] text-base",
  }[size];

  if (isLocked) {
    return (
      <div
        className={`relative ${sizeClasses} rounded-2xl bg-slate-950/80 border-2 border-slate-700/60 p-3 flex flex-col items-center justify-center text-center opacity-70 grayscale select-none shadow-inner`}
      >
        <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-2xl text-slate-400 mb-3">
          🔒
        </div>
        <div className="font-heading font-bold text-slate-400 text-sm mb-1">
          ???
        </div>
        <div className="text-[11px] text-slate-500 capitalize font-medium">
          {card.rarity} Card
        </div>
      </div>
    );
  }

  // For image-based cards: the _art.png IS the complete card (with its own
  // border, title, artwork, description and stats baked in). Render the image
  // as a full-bleed card that fills the entire area — no extra programmatic
  // rarity badges, titles, descriptions, or stat bars needed.
  if (hasImage) {
    return (
      <div
        onClick={onClick}
        className={`group relative ${sizeClasses} rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] select-none shadow-2xl`}
      >
        {/* Full-bleed card image — fills entire card area without table background */}
        <img
          src={`/cards/${card.iconName}_art.png`}
          alt={card.name}
          className="w-full h-full object-fill rounded-2xl"
        />

        {/* Glossy hover shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 rounded-2xl" />

        {/* Duplicate Count Badge */}
        {count > 1 && (
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/85 text-amber-300 font-heading font-black text-xs border border-amber-500/50 shadow-lg z-30">
            x{count}
          </div>
        )}

        {/* Newly Unlocked Badge */}
        {isNew && (
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-heading font-black text-[10px] tracking-wider uppercase border border-white/40 shadow-lg animate-bounce z-30">
            NEW!
          </div>
        )}
      </div>
    );
  }

  // For non-image cards: use the full programmatic card layout with
  // rarity badge, title, SVG artwork, description, and stats
  return (
    <div
      onClick={onClick}
      className={`group relative ${sizeClasses} rounded-2xl bg-gradient-to-b ${config.bgGradient} p-2.5 flex flex-col justify-between border-4 ${config.borderColor} ${config.glow} cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] select-none overflow-hidden shadow-2xl`}
    >
      {/* Glossy Card Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />

      {/* Rarity Star Header */}
      <div className="flex items-center justify-between px-1.5 py-0.5 z-10">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-heading font-extrabold uppercase tracking-wider border ${config.badgeBg}`}
        >
          {config.name}
        </span>
        <div className="flex items-center gap-0.5 text-amber-400">
          {Array.from({ length: config.starCount }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
          ))}
        </div>
      </div>

      {/* Card Title */}
      <div className="text-center z-10 my-0.5">
        <h3 className="font-heading font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide truncate px-1 text-sm sm:text-base">
          {card.name}
        </h3>
      </div>

      {/* Central Artwork Frame */}
      <div className="relative flex-1 my-1 rounded-xl bg-slate-950/70 border border-white/20 overflow-hidden shadow-inner flex items-center justify-center">
        <CardArtwork card={card} />

        {/* Duplicate Count Badge */}
        {count > 1 && (
          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/80 text-amber-300 font-heading font-black text-[11px] border border-amber-500/50 shadow-md">
            x{count}
          </div>
        )}

        {/* Newly Unlocked Badge */}
        {isNew && (
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-heading font-black text-[10px] tracking-wider uppercase border border-white/40 shadow-lg animate-bounce">
            NEW!
          </div>
        )}
      </div>

      {/* Card Description */}
      <div className="px-1 py-1 z-10">
        <p className="text-[10px] sm:text-[11px] text-white/90 leading-tight line-clamp-2 text-center font-medium drop-shadow">
          "{card.description}"
        </p>
      </div>

      {/* Attack & Defense Stats Bar */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 z-10">
        <div className="flex items-center justify-center gap-1 py-0.5 px-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-heading font-bold text-xs shadow-sm">
          <Swords className="w-3 h-3 text-red-400" />
          <span>{card.atk}</span>
        </div>
        <div className="flex items-center justify-center gap-1 py-0.5 px-1.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 font-heading font-bold text-xs shadow-sm">
          <Shield className="w-3 h-3 text-blue-400" />
          <span>{card.def}</span>
        </div>
      </div>
    </div>
  );
}

