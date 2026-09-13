import React from "react";
import type { Card } from "../lib/cards";

interface CardArtworkProps {
  card: Card;
  className?: string;
}

export const IMAGE_CARDS = new Set([
  // Aquatic Pack
  "lionfish",
  "snake",
  "dolphin",
  "coral",
  "octopus",
  "whale",
  "shark",
  "eel",
  "prehistoric_fish",
  "aquargon_hatchling",
  "dragon_aquargon",
  // Volcanic Pack
  "lizard",
  "beetle",
  "crab",
  "turtle",
  "salamander",
  "golem",
  "wyrm",
  "phoenix",
  "volcanis",
  "dino_igniasaur",
]);

export default function CardArtwork({ card, className = "" }: CardArtworkProps) {
  const { iconName, element } = card;

  const hasImage = IMAGE_CARDS.has(iconName);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg select-none ${className}`}>
      {/* Background Gradient & Particle Effects based on Element */}
      {element === "water" && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/20 via-cyan-700/30 to-blue-950/80 flex items-center justify-center pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
        </div>
      )}
      {element === "fire" && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-red-700/30 to-rose-950/90 flex items-center justify-center pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
        </div>
      )}
      {element === "cosmic" && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-700/30 to-slate-950 flex items-center justify-center pointer-events-none">
          <div className="absolute w-36 h-36 rounded-full bg-purple-500/20 blur-2xl animate-pulse" />
        </div>
      )}
      {element === "nature" && (
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-green-700/30 to-stone-950 flex items-center justify-center pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl animate-pulse" />
        </div>
      )}

      {/* High-Resolution Cropped Card Artwork from User Reference Image */}
      {hasImage ? (
        <img
          src={`/cards/${iconName}_art.png`}
          alt={card.name}
          className="w-full h-full object-fill rounded-lg z-10 transition-transform duration-300 group-hover:scale-105 shadow-inner"
        />
      ) : (
        /* SVG Vector Fallback */
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full p-1.5 z-10 drop-shadow-[0_12px_12px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          {/* Water Gradients */}
          <linearGradient id="aquaWing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="aquaDragonScale" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Fire Gradients */}
          <linearGradient id="fireWing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="obsidianArmor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="60%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <radialGradient id="magmaCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

          {/* Cosmic Gradients */}
          <linearGradient id="galaxyWing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="80%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <radialGradient id="nebulaCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#67e8f9" />
            <stop offset="80%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Nature Gradients */}
          <linearGradient id="natureLeaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="ancientWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
        </defs>

        {/* ========================================================================= */}
        {/* MYTHIC DRAGONS */}
        {/* ========================================================================= */}

        {/* --- AQUARGON (Mythic Sea Serpent Dragon) --- */}
        {iconName === "dragon_aquargon" && (
          <g>
            {/* Background Water Waves */}
            <path d="M 0 150 Q 50 130 100 150 T 200 150 L 200 200 L 0 200 Z" fill="#0284c7" opacity="0.3" />
            <path d="M 0 170 Q 50 155 100 170 T 200 170 L 200 200 L 0 200 Z" fill="#0369a1" opacity="0.5" />

            {/* Wing Fins (Left & Right Spread) */}
            <path d="M 65 90 C 20 50 10 10 35 15 C 50 35 60 60 70 85 Z" fill="url(#aquaWing)" stroke="#67e8f9" strokeWidth="1.5" />
            <path d="M 45 40 L 60 65 M 35 25 L 58 50" stroke="#0891b2" strokeWidth="1.5" />
            <path d="M 135 90 C 180 50 190 10 165 15 C 150 35 140 60 130 85 Z" fill="url(#aquaWing)" stroke="#67e8f9" strokeWidth="1.5" />
            <path d="M 155 40 L 140 65 M 165 25 L 142 50" stroke="#0891b2" strokeWidth="1.5" />

            {/* Serpent Dragon Body Coils */}
            <path
              d="M 40 165 C 20 120 70 110 80 135 C 90 160 140 160 155 130 C 170 100 140 70 115 65 C 90 60 85 45 100 25 C 115 15 135 25 125 45"
              fill="none"
              stroke="url(#aquaDragonScale)"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Belly Scales (Cyan Underbelly Plate) */}
            <path
              d="M 40 165 C 20 120 70 110 80 135 C 90 160 140 160 155 130"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="6"
              strokeDasharray="4,3"
            />

            {/* Detailed Dragon Head */}
            <g transform="translate(0, 0)">
              {/* Back Horns */}
              <path d="M 100 25 Q 85 -5 75 0 Q 88 15 95 23 Z" fill="#0891b2" stroke="#22d3ee" strokeWidth="1" />
              <path d="M 105 23 Q 120 -5 130 0 Q 117 15 110 23 Z" fill="#0891b2" stroke="#22d3ee" strokeWidth="1" />
              {/* Head Skull Base */}
              <path d="M 82 30 Q 100 12 118 30 Q 125 45 100 55 Q 75 45 82 30 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              {/* Reptilian Snout & Nostril */}
              <path d="M 90 40 L 100 58 L 110 40" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="97" cy="48" r="1" fill="#22d3ee" />
              <circle cx="103" cy="48" r="1" fill="#22d3ee" />
              {/* Glowing Eyes */}
              <ellipse cx="90" cy="32" rx="4.5" ry="3" fill="#22d3ee" />
              <ellipse cx="110" cy="32" rx="4.5" ry="3" fill="#22d3ee" />
              <line x1="90" y1="29" x2="90" y2="35" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="110" y1="29" x2="110" y2="35" stroke="#0f172a" strokeWidth="1.5" />
              {/* Fangs */}
              <polygon points="93,48 95,55 97,48" fill="#ffffff" />
              <polygon points="103,48 105,55 107,48" fill="#ffffff" />
              {/* Whisker Barbels */}
              <path d="M 85 45 Q 65 55 55 50" stroke="#67e8f9" strokeWidth="1.5" fill="none" />
              <path d="M 115 45 Q 135 55 145 50" stroke="#67e8f9" strokeWidth="1.5" fill="none" />
            </g>
          </g>
        )}

        {/* --- IGNISAR (Mythic Eclipse Flame God Dragon) --- */}
        {iconName === "dragon_ignisar" && (
          <g>
            {/* Background Fire Burst */}
            <circle cx="100" cy="100" r="80" fill="url(#magmaCore)" opacity="0.25" />

            {/* Massive Obsidian Wings with Flame Webbing */}
            <path d="M 70 95 C 10 60 5 10 40 25 C 55 50 65 75 75 90 Z" fill="url(#fireWing)" stroke="#f97316" strokeWidth="2" />
            <path d="M 35 25 L 15 50 L 30 65 L 50 75" fill="none" stroke="#18181b" strokeWidth="3" />
            <path d="M 130 95 C 190 60 195 10 160 25 C 145 50 135 75 125 90 Z" fill="url(#fireWing)" stroke="#f97316" strokeWidth="2" />
            <path d="M 165 25 L 185 50 L 170 65 L 150 75" fill="none" stroke="#18181b" strokeWidth="3" />

            {/* Muscular Armored Dragon Torso */}
            <path d="M 70 170 Q 55 110 100 80 Q 145 110 130 170 Q 100 190 70 170 Z" fill="url(#obsidianArmor)" stroke="#ea580c" strokeWidth="3" />
            {/* Molten Magma Chest Core */}
            <path d="M 88 100 Q 100 85 112 100 Q 120 135 100 155 Q 80 135 88 100 Z" fill="url(#magmaCore)" stroke="#fef08a" strokeWidth="1.5" />

            {/* Roaring Dragon Head */}
            <g>
              {/* Dual Flaming Horns */}
              <path d="M 85 40 Q 60 10 50 5 Q 70 20 80 35 Z" fill="#ef4444" stroke="#facc15" strokeWidth="1" />
              <path d="M 78 45 Q 50 30 40 28 Q 60 38 73 45 Z" fill="#dc2626" />
              <path d="M 115 40 Q 140 10 150 5 Q 130 20 120 35 Z" fill="#ef4444" stroke="#facc15" strokeWidth="1" />
              <path d="M 122 45 Q 150 30 160 28 Q 140 38 127 45 Z" fill="#dc2626" />

              {/* Head Base Plate */}
              <polygon points="75,55 100,20 125,55 100,75" fill="#18181b" stroke="#ef4444" strokeWidth="2.5" />
              {/* Fiery Eye Socket */}
              <polygon points="82,42 93,42 90,48 84,48" fill="#fef08a" />
              <polygon points="118,42 107,42 110,48 116,48" fill="#fef08a" />
              <circle cx="87.5" cy="45" r="1.5" fill="#991b1b" />
              <circle cx="112.5" cy="45" r="1.5" fill="#991b1b" />

              {/* Open Maw & Fire Stream */}
              <path d="M 85 58 Q 100 50 115 58 L 100 82 Z" fill="#7f1d1d" stroke="#f97316" strokeWidth="1.5" />
              <path d="M 92 60 L 100 78 L 108 60" fill="url(#fireWing)" />
              {/* Fangs */}
              <polygon points="86,58 88,64 90,58" fill="#ffffff" />
              <polygon points="114,58 112,64 110,58" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* --- ASTRION (Mythic Cosmic Sovereign Dragon) --- */}
        {iconName === "dragon_astrion" && (
          <g>
            {/* Galaxy Wings */}
            <path d="M 65 95 C 5 60 0 10 45 20 C 60 45 70 70 80 90 Z" fill="url(#galaxyWing)" stroke="#c084fc" strokeWidth="2" />
            <path d="M 135 95 C 195 60 200 10 155 20 C 140 45 130 70 120 90 Z" fill="url(#galaxyWing)" stroke="#c084fc" strokeWidth="2" />
            {/* Stars on Wings */}
            <circle cx="35" cy="35" r="2" fill="#ffffff" />
            <circle cx="50" cy="50" r="1.5" fill="#67e8f9" />
            <circle cx="165" cy="35" r="2" fill="#ffffff" />
            <circle cx="150" cy="50" r="1.5" fill="#67e8f9" />

            {/* Cosmic Body */}
            <ellipse cx="100" cy="125" rx="38" ry="48" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
            <ellipse cx="100" cy="125" rx="22" ry="32" fill="url(#nebulaCore)" opacity="0.7" />

            {/* Starlight Dragon Head */}
            <g>
              {/* Constellation Horns */}
              <path d="M 88 40 Q 70 10 60 5 Q 75 25 85 38 Z" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.5" />
              <path d="M 112 40 Q 130 10 140 5 Q 125 25 115 38 Z" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.5" />

              {/* Head Structure */}
              <path d="M 80 45 Q 100 18 120 45 Q 110 70 100 78 Q 90 70 80 45 Z" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2" />
              {/* Starlight Eyes */}
              <ellipse cx="90" cy="42" rx="4" ry="2.5" fill="#38bdf8" />
              <ellipse cx="110" cy="42" rx="4" ry="2.5" fill="#38bdf8" />
              <circle cx="90" cy="42" r="1" fill="#ffffff" />
              <circle cx="110" cy="42" r="1" fill="#ffffff" />

              {/* Forehead Star Gem */}
              <polygon points="100,28 103,34 100,40 97,34" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
            </g>

            {/* Orbiting Stardust Rings */}
            <ellipse cx="100" cy="125" rx="55" ry="16" fill="none" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="6,4" transform="rotate(-15 100 125)" />
          </g>
        )}

        {/* --- SYLVARGON (Mythic Primordial Forest Dragon) --- */}
        {iconName === "dragon_sylvargon" && (
          <g>
            {/* Leaf Canopy Wings */}
            <path d="M 70 90 C 15 50 0 10 40 20 C 60 40 70 65 78 85 Z" fill="url(#natureLeaf)" stroke="#4ade80" strokeWidth="2" />
            <path d="M 130 90 C 185 50 200 10 160 20 C 140 40 130 65 122 85 Z" fill="url(#natureLeaf)" stroke="#4ade80" strokeWidth="2" />

            {/* Wooden Ancient Bark Body */}
            <path d="M 72 170 Q 55 105 100 75 Q 145 105 128 170 Q 100 190 72 170 Z" fill="url(#ancientWood)" stroke="#22c55e" strokeWidth="3" />
            {/* Glowing Emerald Runes */}
            <path d="M 90 110 L 100 100 L 110 110 M 100 100 L 100 150 M 90 135 L 110 135" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />

            {/* Forest Dragon Head */}
            <g>
              {/* Wooden Antler Horns */}
              <path d="M 85 40 Q 65 15 55 10 Q 65 25 70 20 Q 60 30 75 32 Q 80 25 83 38 Z" fill="#451a03" stroke="#86efac" strokeWidth="1" />
              <path d="M 115 40 Q 135 15 145 10 Q 135 25 130 20 Q 140 30 125 32 Q 120 25 117 38 Z" fill="#451a03" stroke="#86efac" strokeWidth="1" />

              {/* Head Plate */}
              <path d="M 80 45 Q 100 20 120 45 Q 100 75 80 45 Z" fill="#14532d" stroke="#4ade80" strokeWidth="2" />
              {/* Glowing Emerald Eyes */}
              <circle cx="91" cy="45" r="4.5" fill="#facc15" />
              <circle cx="91" cy="45" r="2" fill="#14532d" />
              <circle cx="109" cy="45" r="4.5" fill="#facc15" />
              <circle cx="109" cy="45" r="2" fill="#14532d" />

              {/* Moss Beard / Vines */}
              <path d="M 95 65 Q 100 80 105 65" fill="none" stroke="#22c55e" strokeWidth="2" />
            </g>
          </g>
        )}

        {/* ========================================================================= */}
        {/* AQUATIC PACK CREATURES */}
        {/* ========================================================================= */}

        {/* --- GREAT WHITE SHARK --- */}
        {iconName === "shark" && (
          <g>
            <path d="M 0 140 Q 100 120 200 160 L 200 200 L 0 200 Z" fill="#0369a1" opacity="0.4" />
            {/* Shark Body */}
            <path d="M 20 130 C 40 60 120 40 185 95 C 130 140 70 150 20 130 Z" fill="#475569" stroke="#0f172a" strokeWidth="3" />
            <path d="M 30 132 C 70 135 130 135 185 95 C 140 115 80 120 30 132 Z" fill="#f8fafc" />
            {/* Dorsal Fin */}
            <path d="M 80 68 L 105 25 L 125 60 Z" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            {/* Open Jaws & Sharp White Teeth */}
            <path d="M 145 95 Q 165 95 185 95 C 165 118 145 110 145 95 Z" fill="#7f1d1d" />
            <polygon points="150,95 153,102 156,95 159,102 162,95 165,102 168,95 171,102 174,95" fill="#ffffff" />
            {/* Gills & Eye */}
            <circle cx="140" cy="78" r="4.5" fill="#0f172a" />
            <circle cx="141.5" cy="77" r="1.5" fill="#ffffff" />
            <line x1="110" y1="80" x2="112" y2="95" stroke="#1e293b" strokeWidth="2" />
            <line x1="117" y1="80" x2="119" y2="95" stroke="#1e293b" strokeWidth="2" />
            <line x1="124" y1="80" x2="126" y2="95" stroke="#1e293b" strokeWidth="2" />
          </g>
        )}

        {/* --- DUNKLEOSTEUS (Prehistoric Armored Fish) --- */}
        {iconName === "prehistoric_fish" && (
          <g>
            {/* Tail & Body */}
            <path d="M 20 110 Q 70 60 140 70 L 180 100 L 140 130 Q 70 140 20 110 Z" fill="#451a03" stroke="#78350f" strokeWidth="3" />
            {/* Heavy Bone Plate Head Armor */}
            <path d="M 90 65 Q 140 55 180 100 Q 140 135 90 125 Z" fill="#78350f" stroke="#f59e0b" strokeWidth="3" />
            {/* Jagged Bone Jaw Plates (No teeth, actual bone blades) */}
            <path d="M 130 90 L 175 100 L 140 115 Z" fill="#292524" />
            <polygon points="135,92 145,104 150,95 160,105 168,99" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            {/* Eye in Bone Socket */}
            <circle cx="135" cy="78" r="6" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="135" cy="78" r="2.5" fill="#f59e0b" />
          </g>
        )}

        {/* --- ORCA (Killer Whale) --- */}
        {iconName === "whale" && (
          <g>
            {/* Main Black Body */}
            <path d="M 20 130 C 40 50 130 50 185 105 C 130 155 60 160 20 130 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            {/* White Underbelly Patch */}
            <path d="M 40 135 C 80 155 135 145 185 105 C 150 135 90 140 40 135 Z" fill="#f8fafc" />
            {/* White Eye Patch */}
            <ellipse cx="145" cy="85" rx="9" ry="5" fill="#f8fafc" transform="rotate(-15 145 85)" />
            {/* Eye & Dorsal Fin */}
            <circle cx="140" cy="88" r="2" fill="#0f172a" />
            <path d="M 90 65 L 105 15 L 125 55 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          </g>
        )}

        {/* --- OCTOPUS --- */}
        {iconName === "octopus" && (
          <g>
            {/* 8 Detailed Tentacles */}
            <path d="M 60 110 C 30 170 10 130 45 145 C 70 155 75 120 70 110" fill="#7e22ce" stroke="#a855f7" strokeWidth="2" />
            <path d="M 75 115 C 50 180 30 150 65 165 C 90 175 90 130 85 115" fill="#7e22ce" stroke="#a855f7" strokeWidth="2" />
            <path d="M 115 115 C 110 180 130 170 135 155 C 140 135 125 130 120 115" fill="#7e22ce" stroke="#a855f7" strokeWidth="2" />
            <path d="M 130 110 C 160 170 180 130 155 145 C 130 155 125 120 125 110" fill="#7e22ce" stroke="#a855f7" strokeWidth="2" />
            {/* Sucker Disks */}
            <circle cx="35" cy="140" r="2.5" fill="#ffffff" />
            <circle cx="50" cy="155" r="2.5" fill="#ffffff" />
            <circle cx="150" cy="155" r="2.5" fill="#ffffff" />
            <circle cx="165" cy="140" r="2.5" fill="#ffffff" />
            {/* Bulbous Head */}
            <ellipse cx="100" cy="75" rx="42" ry="38" fill="#9333ea" stroke="#c084fc" strokeWidth="3" />
            {/* Eyes with Slit Pupil */}
            <ellipse cx="82" cy="75" rx="7" ry="9" fill="#ffffff" />
            <ellipse cx="118" cy="75" rx="7" ry="9" fill="#ffffff" />
            <line x1="82" y1="68" x2="82" y2="82" stroke="#000000" strokeWidth="3" />
            <line x1="118" y1="68" x2="118" y2="82" stroke="#000000" strokeWidth="3" />
          </g>
        )}

        {/* --- LIONFISH --- */}
        {iconName === "lionfish" && (
          <g>
            {/* Spiky Pectoral Fin Fans */}
            <path d="M 100 100 L 20 40 M 100 100 L 15 70 M 100 100 L 25 100 M 100 100 L 30 130 M 100 100 L 50 160" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <path d="M 100 100 L 180 40 M 100 100 L 185 70 M 100 100 L 175 100 M 100 100 L 170 130 M 100 100 L 150 160" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            {/* Striped Fish Body */}
            <ellipse cx="100" cy="100" rx="38" ry="26" fill="#ea580c" stroke="#ffffff" strokeWidth="3" />
            <line x1="85" y1="76" x2="85" y2="124" stroke="#ffffff" strokeWidth="4" />
            <line x1="100" y1="74" x2="100" y2="126" stroke="#ffffff" strokeWidth="4" />
            <line x1="115" y1="76" x2="115" y2="124" stroke="#ffffff" strokeWidth="4" />
            {/* Eye */}
            <circle cx="124" cy="94" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
            <circle cx="125.5" cy="92.5" r="1.5" fill="#ffffff" />
          </g>
        )}

        {/* --- GULPER EEL --- */}
        {iconName === "eel" && (
          <g>
            {/* Ribbon Body */}
            <path d="M 20 150 Q 60 90 110 130 Q 160 170 165 75" fill="none" stroke="#1e1b4b" strokeWidth="14" strokeLinecap="round" />
            {/* Enormous Scoop Jaw */}
            <path d="M 120 75 Q 165 35 185 75 Q 165 115 120 75 Z" fill="#312e81" stroke="#818cf8" strokeWidth="2.5" />
            <path d="M 130 75 Q 165 50 180 75 Z" fill="#000000" opacity="0.6" />
            {/* Bioluminescent Bulb Tail Tip */}
            <circle cx="20" cy="150" r="6" fill="#ec4899" />
            <circle cx="20" cy="150" r="10" fill="#ec4899" opacity="0.3" />
          </g>
        )}

        {/* --- SEA SNAKE --- */}
        {iconName === "snake" && (
          <g>
            <path d="M 30 140 C 70 180 130 150 100 100 C 70 50 130 30 160 70" fill="none" stroke="#0891b2" strokeWidth="16" strokeLinecap="round" />
            <path d="M 30 140 C 70 180 130 150 100 100 C 70 50 130 30 160 70" fill="none" stroke="#67e8f9" strokeWidth="4" strokeDasharray="8,8" />
            <circle cx="160" cy="70" r="11" fill="#0e7490" />
            <circle cx="163" cy="67" r="2" fill="#ffffff" />
            <path d="M 170 70 L 182 66 M 170 70 L 182 74" stroke="#ef4444" strokeWidth="2" />
          </g>
        )}

        {/* --- DOLPHIN --- */}
        {iconName === "dolphin" && (
          <g>
            <path d="M 20 130 C 50 40 140 50 185 85 C 140 120 80 140 20 130 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
            <path d="M 40 130 C 80 135 140 115 185 85 C 140 105 80 110 40 130 Z" fill="#e0f2fe" />
            <path d="M 95 65 L 115 35 L 125 60 Z" fill="#0284c7" />
            <circle cx="160" cy="78" r="3" fill="#0f172a" />
          </g>
        )}

        {/* --- CORAL REEF --- */}
        {iconName === "coral" && (
          <g>
            <path d="M 40 180 Q 30 100 60 110 Q 75 70 95 110 Q 120 60 135 110 Q 165 90 160 180 Z" fill="#f43f5e" stroke="#fb7185" strokeWidth="4" />
            <circle cx="60" cy="110" r="5" fill="#ffe4e6" />
            <circle cx="95" cy="110" r="6" fill="#ffe4e6" />
            <circle cx="135" cy="110" r="5" fill="#ffe4e6" />
          </g>
        )}

        {/* ========================================================================= */}
        {/* VOLCANIC PACK CREATURES */}
        {/* ========================================================================= */}

        {/* --- PHOENIX DRAKE (Epic Fire Dragon Bird) --- */}
        {iconName === "phoenix" && (
          <g>
            {/* Spread Fire Wings */}
            <path d="M 70 100 C 20 60 10 10 50 30 C 65 50 75 80 80 95 Z" fill="url(#fireWing)" stroke="#facc15" strokeWidth="2" />
            <path d="M 130 100 C 180 60 190 10 150 30 C 135 50 125 80 120 95 Z" fill="url(#fireWing)" stroke="#facc15" strokeWidth="2" />
            {/* Feathers */}
            <path d="M 40 40 L 60 65 M 30 25 L 55 50" stroke="#dc2626" strokeWidth="2" />
            <path d="M 160 40 L 140 65 M 170 25 L 145 50" stroke="#dc2626" strokeWidth="2" />
            {/* Dragon Bird Head */}
            <circle cx="100" cy="75" r="22" fill="#ef4444" stroke="#facc15" strokeWidth="2" />
            <path d="M 100 70 L 132 80 L 100 90 Z" fill="#facc15" stroke="#ea580c" strokeWidth="1.5" />
            <circle cx="95" cy="70" r="3.5" fill="#000000" />
            <circle cx="96" cy="69" r="1" fill="#ffffff" />
            {/* Crown Feathers */}
            <path d="M 90 55 Q 85 30 100 35 Q 105 30 100 55 Z" fill="#facc15" />
          </g>
        )}

        {/* --- INFERNAL WYRM (Epic Lava Dragon Serpent) --- */}
        {iconName === "wyrm" && (
          <g>
            <path d="M 30 160 Q 80 60 140 130" fill="none" stroke="#7f1d1d" strokeWidth="24" strokeLinecap="round" />
            <path d="M 30 160 Q 80 60 140 130" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" />
            {/* Spiky Dragon Serpent Head */}
            <path d="M 130 110 L 175 130 L 145 155 Z" fill="#991b1b" stroke="#facc15" strokeWidth="2" />
            <circle cx="150" cy="125" r="3.5" fill="#fef08a" />
          </g>
        )}

        {/* --- VOLCANIS (Legendary Obsidian Dragon Titan) --- */}
        {iconName === "volcanis" && (
          <g>
            <path d="M 30 170 Q 100 40 170 170 Z" fill="#18181b" stroke="#ef4444" strokeWidth="4" />
            <path d="M 60 170 Q 100 80 140 170 Z" fill="url(#magmaCore)" opacity="0.8" />
            <polygon points="100,50 85,85 115,85" fill="#ef4444" stroke="#facc15" strokeWidth="2" />
            <circle cx="90" cy="100" r="4" fill="#fef08a" />
            <circle cx="110" cy="100" r="4" fill="#fef08a" />
          </g>
        )}

        {/* --- MOLTEN GOLEM --- */}
        {iconName === "golem" && (
          <g>
            <rect x="55" y="60" width="90" height="100" rx="16" fill="#27272a" stroke="#ea580c" strokeWidth="4" />
            <path d="M 55 90 L 145 90 M 100 60 L 100 160" stroke="#f97316" strokeWidth="3" />
            <ellipse cx="80" cy="85" rx="8" ry="4" fill="#fef08a" />
            <ellipse cx="120" cy="85" rx="8" ry="4" fill="#fef08a" />
          </g>
        )}

        {/* --- MAGMA TURTLE --- */}
        {iconName === "turtle" && (
          <g>
            <path d="M 40 130 C 40 60 160 60 160 130 Z" fill="#78350f" stroke="#ea580c" strokeWidth="4" />
            <path d="M 80 75 L 100 60 L 120 75" stroke="#f97316" strokeWidth="3" fill="none" />
            <circle cx="160" cy="125" r="14" fill="#451a03" stroke="#ea580c" strokeWidth="2" />
            <circle cx="164" cy="122" r="3" fill="#fef08a" />
          </g>
        )}

        {/* --- LAVA CRAB --- */}
        {iconName === "crab" && (
          <g>
            <ellipse cx="100" cy="115" rx="45" ry="28" fill="#dc2626" stroke="#991b1b" strokeWidth="4" />
            <path d="M 40 95 C 20 50 60 40 65 75 Z" fill="#f97316" stroke="#b91c1c" strokeWidth="2" />
            <path d="M 160 95 C 180 50 140 40 135 75 Z" fill="#f97316" stroke="#b91c1c" strokeWidth="2" />
            <circle cx="85" cy="98" r="4" fill="#ffffff" />
            <circle cx="85" cy="98" r="2" fill="#000000" />
            <circle cx="115" cy="98" r="4" fill="#ffffff" />
            <circle cx="115" cy="98" r="2" fill="#000000" />
          </g>
        )}

        {/* --- EMBER BEETLE --- */}
        {iconName === "beetle" && (
          <g>
            <ellipse cx="100" cy="115" rx="38" ry="32" fill="#b45309" stroke="#ef4444" strokeWidth="4" />
            <path d="M 100 83 L 100 147" stroke="#78350f" strokeWidth="3" />
            <circle cx="100" cy="70" r="18" fill="#78350f" />
            <path d="M 100 65 L 100 35 L 90 25 M 100 35 L 110 25" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* --- FLAME LIZARD --- */}
        {iconName === "lizard" && (
          <g>
            <path d="M 30 150 Q 90 60 160 110" fill="none" stroke="#ea580c" strokeWidth="16" strokeLinecap="round" />
            <circle cx="160" cy="110" r="13" fill="#c2410c" />
            <circle cx="163" cy="107" r="3" fill="#fef08a" />
            <path d="M 30 150 Q 20 160 10 145 Q 25 140 30 150 Z" fill="#ef4444" />
          </g>
        )}

        {/* --- FIRE SALAMANDER --- */}
        {iconName === "salamander" && (
          <g>
            <path d="M 40 140 Q 90 70 150 120" fill="none" stroke="#1c1917" strokeWidth="18" strokeLinecap="round" />
            <path d="M 40 140 Q 90 70 150 120" fill="none" stroke="#facc15" strokeWidth="6" strokeDasharray="6,8" strokeLinecap="round" />
            <circle cx="150" cy="120" r="12" fill="#1c1917" />
            <circle cx="153" cy="117" r="3" fill="#facc15" />
          </g>
        )}

        {/* ========================================================================= */}
        {/* CELESTIAL PACK CREATURES */}
        {/* ========================================================================= */}

        {/* --- ECLIPSE WYRM (Legendary Cosmic Dragon) --- */}
        {iconName === "wyrm_cosmic" && (
          <g>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#c084fc" strokeWidth="3" />
            <circle cx="100" cy="100" r="45" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 30 140 Q 100 20 170 140" fill="none" stroke="#6b21a8" strokeWidth="20" strokeLinecap="round" />
            <circle cx="170" cy="140" r="14" fill="#581c87" />
            <circle cx="174" cy="136" r="4" fill="#38bdf8" />
          </g>
        )}

        {/* --- STARLIGHT PEGASUS --- */}
        {iconName === "pegasus" && (
          <g>
            {/* Wing */}
            <path d="M 70 90 C 30 40 10 20 50 30 C 70 45 80 75 85 85 Z" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="2" />
            {/* Horse Neck & Head */}
            <path d="M 60 140 Q 90 60 140 75 Q 160 80 145 95 Q 110 90 85 140 Z" fill="#f8fafc" stroke="#818cf8" strokeWidth="2.5" />
            {/* Starry Mane */}
            <path d="M 85 70 Q 60 50 75 40 Q 95 55 90 75 Z" fill="#c084fc" />
            <circle cx="140" cy="80" r="3" fill="#000000" />
          </g>
        )}

        {/* --- MOON OWL --- */}
        {iconName === "owl" && (
          <g>
            {/* Crescent Moon */}
            <path d="M 120 30 A 65 65 0 1 0 160 140 A 50 50 0 1 1 120 30 Z" fill="#fef08a" opacity="0.8" />
            {/* Body */}
            <ellipse cx="90" cy="115" rx="30" ry="38" fill="#312e81" stroke="#818cf8" strokeWidth="3" />
            {/* Eyes */}
            <circle cx="78" cy="100" r="11" fill="#fef08a" stroke="#000" strokeWidth="1" />
            <circle cx="78" cy="100" r="4" fill="#000000" />
            <circle cx="102" cy="100" r="11" fill="#fef08a" stroke="#000" strokeWidth="1" />
            <circle cx="102" cy="100" r="4" fill="#000000" />
            <polygon points="90,108 84,118 96,118" fill="#f97316" />
          </g>
        )}

        {/* --- VOID CHIMERA --- */}
        {iconName === "chimera" && (
          <g>
            <circle cx="100" cy="105" r="44" fill="#1e1b4b" stroke="#a855f7" strokeWidth="4" />
            <path d="M 70 70 L 60 40 M 130 70 L 140 40" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="95" r="6" fill="#ef4444" />
            <circle cx="120" cy="95" r="6" fill="#06b6d4" />
          </g>
        )}

        {/* --- GALAXY SENTINEL --- */}
        {iconName === "sentinel" && (
          <g>
            <rect x="65" y="55" width="70" height="95" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />
            <rect x="75" y="75" width="50" height="12" rx="6" fill="#38bdf8" />
            <polygon points="100,100 115,130 85,130" fill="#a855f7" />
          </g>
        )}

        {/* --- COMET FOX --- */}
        {iconName === "fox" && (
          <g>
            <polygon points="50,140 100,60 150,140" fill="#a855f7" stroke="#e9d5ff" strokeWidth="3" />
            <polygon points="100,100 80,140 120,140" fill="#ffffff" />
            <circle cx="82" cy="95" r="4" fill="#000000" />
            <circle cx="118" cy="95" r="4" fill="#000000" />
          </g>
        )}

        {/* --- ASTRO CAT --- */}
        {iconName === "cat" && (
          <g>
            {/* Astronaut Helmet */}
            <circle cx="100" cy="100" r="48" fill="none" stroke="#38bdf8" strokeWidth="4" />
            <circle cx="100" cy="100" r="42" fill="#1e293b" opacity="0.8" />
            {/* Cat Head */}
            <circle cx="100" cy="100" r="30" fill="#64748b" />
            <polygon points="75,80 80,60 90,75" fill="#475569" />
            <polygon points="125,80 120,60 110,75" fill="#475569" />
            <circle cx="88" cy="96" r="4" fill="#facc15" />
            <circle cx="112" cy="96" r="4" fill="#facc15" />
          </g>
        )}

        {/* --- NEBULA JELLY --- */}
        {iconName === "jellyfish" && (
          <g>
            <path d="M 50 100 C 50 40 150 40 150 100 Z" fill="#a855f7" opacity="0.75" stroke="#c084fc" strokeWidth="3" />
            <path d="M 65 100 L 65 165 M 85 100 L 85 175 M 115 100 L 115 175 M 135 100 L 135 165" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {/* --- STAR BUNNY --- */}
        {iconName === "bunny" && (
          <g>
            <path d="M 80 85 C 70 30 90 30 92 85 Z" fill="#c7d2fe" stroke="#818cf8" strokeWidth="2" />
            <path d="M 120 85 C 130 30 110 30 108 85 Z" fill="#c7d2fe" stroke="#818cf8" strokeWidth="2" />
            <circle cx="100" cy="115" r="32" fill="#e0e7ff" stroke="#818cf8" strokeWidth="3" />
            <circle cx="90" cy="110" r="3.5" fill="#000000" />
            <circle cx="110" cy="110" r="3.5" fill="#000000" />
          </g>
        )}

        {/* ========================================================================= */}
        {/* ANCIENT WILDS PACK CREATURES */}
        {/* ========================================================================= */}

        {/* --- SABER TOOTH TIGER --- */}
        {iconName === "tiger" && (
          <g>
            {/* Tiger Head */}
            <circle cx="100" cy="95" r="38" fill="#ea580c" stroke="#9a3412" strokeWidth="3.5" />
            {/* Stripes */}
            <path d="M 70 80 L 85 85 M 130 80 L 115 85 M 100 60 L 100 75" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="84" cy="90" r="5" fill="#facc15" />
            <circle cx="84" cy="90" r="2" fill="#000000" />
            <circle cx="116" cy="90" r="5" fill="#facc15" />
            <circle cx="116" cy="90" r="2" fill="#000000" />
            {/* Enormous Saber Tusks */}
            <path d="M 86 110 L 84 145 L 92 112 Z" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
            <path d="M 114 110 L 116 145 L 108 112 Z" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
          </g>
        )}

        {/* --- MAMMOTH TITAN --- */}
        {iconName === "mammoth" && (
          <g>
            {/* Shaggy Head */}
            <circle cx="100" cy="95" r="44" fill="#78350f" stroke="#451a03" strokeWidth="4" />
            {/* Giant Curved Ivory Tusks */}
            <path d="M 65 110 C 30 160 10 120 50 105" fill="none" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
            <path d="M 135 110 C 170 160 190 120 150 105" fill="none" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
            {/* Trunk */}
            <path d="M 100 105 Q 90 160 115 155" fill="none" stroke="#451a03" strokeWidth="14" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="82" cy="85" r="3.5" fill="#000000" />
            <circle cx="118" cy="85" r="3.5" fill="#000000" />
          </g>
        )}

        {/* --- WILD BEHEMOTH --- */}
        {iconName === "behemoth" && (
          <g>
            {/* Neck Armor Frill */}
            <path d="M 40 110 C 40 40 160 40 160 110 Z" fill="#15803d" stroke="#86efac" strokeWidth="4" />
            {/* Head */}
            <rect x="60" y="80" width="80" height="75" rx="18" fill="#14532d" stroke="#22c55e" strokeWidth="3" />
            {/* 3 Horns */}
            <polygon points="75,80 70,45 82,80" fill="#fef08a" />
            <polygon points="125,80 130,45 118,80" fill="#fef08a" />
            <polygon points="100,100 100,65 106,100" fill="#fef08a" />
          </g>
        )}

        {/* --- SPIRIT WOLF --- */}
        {iconName === "wolf" && (
          <g>
            <polygon points="55,145 100,50 145,145" fill="#0e7490" stroke="#67e8f9" strokeWidth="3.5" />
            <polygon points="100,95 85,145 115,145" fill="#155e75" />
            <circle cx="86" cy="92" r="4.5" fill="#22d3ee" />
            <circle cx="114" cy="92" r="4.5" fill="#22d3ee" />
          </g>
        )}

        {/* --- GIANT FALCON --- */}
        {iconName === "falcon" && (
          <g>
            <path d="M 20 110 C 60 40 140 40 180 110 C 120 135 80 135 20 110 Z" fill="#854d0e" stroke="#fef08a" strokeWidth="3" />
            <path d="M 145 90 L 175 100 L 145 110 Z" fill="#f59e0b" />
            <circle cx="130" cy="85" r="4.5" fill="#000000" />
            <circle cx="131.5" cy="83.5" r="1.5" fill="#ffffff" />
          </g>
        )}

        {/* --- VINE VIPER --- */}
        {iconName === "vine_snake" && (
          <g>
            <path d="M 30 150 Q 80 50 140 120" fill="none" stroke="#16a34a" strokeWidth="18" strokeLinecap="round" />
            <path d="M 30 150 Q 80 50 140 120" fill="none" stroke="#4ade80" strokeWidth="4" strokeDasharray="6,6" />
            <circle cx="140" cy="120" r="12" fill="#15803d" />
            <circle cx="143" cy="117" r="3" fill="#fef08a" />
          </g>
        )}

        {/* --- MOSSY TOAD --- */}
        {iconName === "toad" && (
          <g>
            <ellipse cx="100" cy="115" rx="42" ry="30" fill="#15803d" stroke="#86efac" strokeWidth="3" />
            {/* Mushrooms on Back */}
            <path d="M 80 88 L 80 75 M 100 85 L 100 68 M 120 88 L 120 75" stroke="#ffffff" strokeWidth="3" />
            <ellipse cx="80" cy="73" rx="7" ry="4" fill="#ef4444" />
            <ellipse cx="100" cy="66" rx="9" ry="5" fill="#ef4444" />
            <ellipse cx="120" cy="73" rx="7" ry="4" fill="#ef4444" />
            {/* Eyes */}
            <circle cx="78" cy="98" r="7" fill="#facc15" />
            <circle cx="78" cy="98" r="3" fill="#000000" />
            <circle cx="122" cy="98" r="7" fill="#facc15" />
            <circle cx="122" cy="98" r="3" fill="#000000" />
          </g>
        )}

        {/* --- FOREST MONKEY --- */}
        {iconName === "monkey" && (
          <g>
            <circle cx="100" cy="95" r="35" fill="#78350f" stroke="#b45309" strokeWidth="3" />
            <ellipse cx="100" cy="105" rx="22" ry="16" fill="#fef3c7" />
            <circle cx="86" cy="88" r="4" fill="#000000" />
            <circle cx="114" cy="88" r="4" fill="#000000" />
            <ellipse cx="100" cy="108" rx="6" ry="4" fill="#78350f" />
          </g>
        )}

        {/* --- LEAF BEETLE / INSECT --- */}
        {iconName === "leaf_insect" && (
          <g>
            <path d="M 40 130 C 40 50 160 50 160 130 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
            <line x1="100" y1="55" x2="100" y2="130" stroke="#166534" strokeWidth="3" />
            <line x1="100" y1="80" x2="60" y2="100" stroke="#166534" strokeWidth="2" />
            <line x1="100" y1="80" x2="140" y2="100" stroke="#166534" strokeWidth="2" />
          </g>
        )}
      </svg>
      )}
    </div>
  );
}
