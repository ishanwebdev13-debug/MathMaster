import { getLocalProgress, saveLocalProgress } from "./progress";

export type CardRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface Card {
  id: string;
  name: string;
  packId: string;
  rarity: CardRarity;
  dropRate: number; // percentage e.g. 17, 10, 5, 1.9, 0.1
  description: string;
  atk: number;
  def: number;
  element: "water" | "fire" | "cosmic" | "nature";
  iconName: string;
}

export interface Pack {
  id: string;
  name: string;
  tagline: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  price: number;
  description: string;
  bannerIcon: string;
  featuredMythic: string;
}

export interface InventoryCard {
  cardId: string;
  count: number;
  firstUnlockedAt: string;
}

export const RARITY_CONFIG: Record<CardRarity, {
  name: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  glow: string;
  bgGradient: string;
  starCount: number;
}> = {
  common: {
    name: "Common",
    color: "#94a3b8",
    borderColor: "border-slate-400 dark:border-slate-600",
    badgeBg: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-400/40",
    glow: "shadow-slate-400/20",
    bgGradient: "from-slate-100 via-slate-200 to-slate-300 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900",
    starCount: 1,
  },
  rare: {
    name: "Rare",
    color: "#3b82f6",
    borderColor: "border-blue-500 dark:border-blue-400",
    badgeBg: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-400/40",
    glow: "shadow-blue-500/40 shadow-lg",
    bgGradient: "from-blue-900/40 via-sky-800/30 to-indigo-900/50",
    starCount: 2,
  },
  epic: {
    name: "Epic",
    color: "#a855f7",
    borderColor: "border-purple-500 dark:border-purple-400",
    badgeBg: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-400/40",
    glow: "shadow-purple-500/50 shadow-xl ring-2 ring-purple-500/30",
    bgGradient: "from-purple-900/50 via-fuchsia-800/30 to-indigo-950/60",
    starCount: 3,
  },
  legendary: {
    name: "Legendary",
    color: "#eab308",
    borderColor: "border-amber-400 dark:border-amber-300",
    badgeBg: "bg-amber-500/25 text-amber-700 dark:text-amber-300 border-amber-400/60",
    glow: "shadow-amber-400/60 shadow-2xl ring-2 ring-amber-400/50 animate-pulse",
    bgGradient: "from-amber-950/60 via-yellow-900/40 to-orange-950/70",
    starCount: 4,
  },
  mythic: {
    name: "Mythic",
    color: "#ec4899",
    borderColor: "border-pink-500 dark:border-cyan-400",
    badgeBg: "bg-gradient-to-r from-pink-500/30 to-cyan-500/30 text-pink-300 border-pink-400/60",
    glow: "shadow-cyan-400/80 shadow-2xl ring-4 ring-pink-500/50 animate-bounce-subtle",
    bgGradient: "from-slate-950 via-purple-950 to-cyan-950",
    starCount: 5,
  },
};

export const PACKS: Pack[] = [
  {
    id: "aquatic",
    name: "Aquatic Pack",
    tagline: "Oceanic Legends",
    themeColor: "#06b6d4",
    accentColor: "#38bdf8",
    bgGradient: "from-cyan-900/80 via-blue-900/60 to-slate-900",
    price: 30,
    description: "Deep sea predators and mythical ocean titans. Features the legendary Aquargon dragon!",
    bannerIcon: "🌊",
    featuredMythic: "aquargon",
  },
  {
    id: "volcanic",
    name: "Volcanic Pack",
    tagline: "Infernal Flames",
    themeColor: "#f97316",
    accentColor: "#ef4444",
    bgGradient: "from-orange-900/80 via-red-900/60 to-zinc-900",
    price: 30,
    description: "Molten beasts born from volcanic depths. Features the Mythic Igniasaur!",
    bannerIcon: "🌋",
    featuredMythic: "igniasaur",
  },
  {
    id: "celestial",
    name: "Celestial Pack",
    tagline: "Cosmic Wonders",
    themeColor: "#a855f7",
    accentColor: "#c084fc",
    bgGradient: "from-purple-950/90 via-indigo-900/60 to-slate-950",
    price: 30,
    description: "Starlight guardians and void creatures. Features the Mythic Sovereign Dragon Astrion!",
    bannerIcon: "✨",
    featuredMythic: "astrion",
  },
  {
    id: "wilds",
    name: "Ancient Wilds Pack",
    tagline: "Primordial Forest",
    themeColor: "#22c55e",
    accentColor: "#4ade80",
    bgGradient: "from-emerald-950/80 via-green-900/60 to-stone-900",
    price: 30,
    description: "Prehistoric giants and enchanted forest spirits. Features the Mythic Sylvargon!",
    bannerIcon: "🌿",
    featuredMythic: "sylvargon",
  },
];

export const CARDS: Card[] = [
  // --- PACK 1: AQUATIC PACK ---
  {
    id: "lion_fish",
    name: "Lion Fish",
    packId: "aquatic",
    rarity: "common",
    dropRate: 17,
    description: "Vibrant and venomous reef swimmer with showy spiky fins.",
    atk: 120,
    def: 90,
    element: "water",
    iconName: "lionfish",
  },
  {
    id: "sea_snake",
    name: "Sea Snake",
    packId: "aquatic",
    rarity: "common",
    dropRate: 17,
    description: "Swift aquatic viper that glides through ocean currents like lightning.",
    atk: 140,
    def: 70,
    element: "water",
    iconName: "snake",
  },
  {
    id: "dolphin",
    name: "Dolphin",
    packId: "aquatic",
    rarity: "common",
    dropRate: 17,
    description: "Playful ocean mammal equipped with hyper-sonar wave blasts.",
    atk: 110,
    def: 130,
    element: "water",
    iconName: "dolphin",
  },
  {
    id: "coral_reef",
    name: "Coral Reef",
    packId: "aquatic",
    rarity: "common",
    dropRate: 17,
    description: "Living aquatic fortress that shields sea companions with calcium armor.",
    atk: 40,
    def: 210,
    element: "water",
    iconName: "coral",
  },
  {
    id: "octopus",
    name: "Octopus",
    packId: "aquatic",
    rarity: "rare",
    dropRate: 10,
    description: "Master of camouflage with eight multi-tasking tentacles.",
    atk: 220,
    def: 190,
    element: "water",
    iconName: "octopus",
  },
  {
    id: "orca",
    name: "Orca",
    packId: "aquatic",
    rarity: "rare",
    dropRate: 10,
    description: "Apex ocean hunter that strikes with coordinated pod surges.",
    atk: 260,
    def: 220,
    element: "water",
    iconName: "whale",
  },
  {
    id: "great_white_shark",
    name: "Great White Shark",
    packId: "aquatic",
    rarity: "epic",
    dropRate: 5,
    description: "Fearsome marine predator with razor-sharp jaws and relentless drive.",
    atk: 410,
    def: 310,
    element: "water",
    iconName: "shark",
  },
  {
    id: "gulper_eel",
    name: "Gulper Eel",
    packId: "aquatic",
    rarity: "epic",
    dropRate: 5,
    description: "Mysterious abyss dweller with an enormous glowing jaw.",
    atk: 390,
    def: 280,
    element: "water",
    iconName: "eel",
  },
  {
    id: "dunkleosteus",
    name: "Dunkleosteus",
    packId: "aquatic",
    rarity: "legendary",
    dropRate: 1.9,
    description: "Ancient armored terror of the Devonian seas with steel-shattering bite force.",
    atk: 680,
    def: 590,
    element: "water",
    iconName: "prehistoric_fish",
  },
  {
    id: "aquargon_hatchling",
    name: "Aquargon Hatchling",
    packId: "aquatic",
    rarity: "legendary",
    dropRate: 1.5,
    description: "Possesses the potential for mythic power. Its very presence portends great change.",
    atk: 880,
    def: 990,
    element: "water",
    iconName: "aquargon_hatchling",
  },
  {
    id: "aquargon",
    name: "Aquargon",
    packId: "aquatic",
    rarity: "mythic",
    dropRate: 0.1,
    description: "Mythical sea dragon with a jet-black serpent body and radiant turquoise wing-fins.",
    atk: 990,
    def: 880,
    element: "water",
    iconName: "dragon_aquargon",
  },

  // --- PACK 2: VOLCANIC PACK ---
  {
    id: "flame_lizard",
    name: "Flame Lizard",
    packId: "volcanic",
    rarity: "common",
    dropRate: 17,
    description: "Small fiery reptile that leaves trails of ember sparks wherever it dashes.",
    atk: 130,
    def: 80,
    element: "fire",
    iconName: "lizard",
  },
  {
    id: "ember_beetle",
    name: "Ember Beetle",
    packId: "volcanic",
    rarity: "common",
    dropRate: 17,
    description: "Hardened lava insect that explodes with thermal heat when threatened.",
    atk: 100,
    def: 150,
    element: "fire",
    iconName: "beetle",
  },
  {
    id: "lava_crab",
    name: "Lava Crab",
    packId: "volcanic",
    rarity: "common",
    dropRate: 17,
    description: "Heavy crustacean carrying a boiling magma shell on its back.",
    atk: 120,
    def: 170,
    element: "fire",
    iconName: "crab",
  },
  {
    id: "magma_turtle",
    name: "Magma Turtle",
    packId: "volcanic",
    rarity: "common",
    dropRate: 17,
    description: "Ancient slow-moving tortoise infused with volcanic core energy.",
    atk: 70,
    def: 220,
    element: "fire",
    iconName: "turtle",
  },
  {
    id: "fire_salamander",
    name: "Fire Salamander",
    packId: "volcanic",
    rarity: "rare",
    dropRate: 10,
    description: "Agile elemental spirit that dances through molten streams.",
    atk: 250,
    def: 180,
    element: "fire",
    iconName: "salamander",
  },
  {
    id: "molten_golem",
    name: "Molten Golem",
    packId: "volcanic",
    rarity: "rare",
    dropRate: 10,
    description: "Towering construct of jagged basalt rock held together by liquid fire.",
    atk: 230,
    def: 280,
    element: "fire",
    iconName: "golem",
  },
  {
    id: "phoenix_drake",
    name: "Phoenix Drake",
    packId: "volcanic",
    rarity: "epic",
    dropRate: 5,
    description: "Glorious flaming bird dragon reborn from glowing volcanic ash.",
    atk: 420,
    def: 300,
    element: "fire",
    iconName: "phoenix",
  },
  {
    id: "infernal_wyrm",
    name: "Infernal Wyrm",
    packId: "volcanic",
    rarity: "epic",
    dropRate: 5,
    description: "Subterranean magma serpent that burrows through solid magma rock.",
    atk: 440,
    def: 290,
    element: "fire",
    iconName: "wyrm",
  },
  {
    id: "volcanis",
    name: "Volcanis",
    packId: "volcanic",
    rarity: "legendary",
    dropRate: 1.9,
    description: "Ancient Leviathan of the Earth's mantel, whose roar causes volcanic eruptions.",
    atk: 710,
    def: 620,
    element: "fire",
    iconName: "volcanis",
  },
  {
    id: "igniasaur",
    name: "Igniasaur",
    packId: "volcanic",
    rarity: "mythic",
    dropRate: 0.1,
    description: "The Primordial Magma Dinosaur Titan, encased in volcanic obsidian armor with a searing fire crest.",
    atk: 1020,
    def: 850,
    element: "fire",
    iconName: "dino_igniasaur",
  },

  // --- PACK 3: CELESTIAL PACK ---
  {
    id: "star_bunny",
    name: "Star Bunny",
    packId: "celestial",
    rarity: "common",
    dropRate: 17,
    description: "Adorable cosmic rabbit that hops across meteor showers.",
    atk: 100,
    def: 90,
    element: "cosmic",
    iconName: "bunny",
  },
  {
    id: "nebula_jelly",
    name: "Nebula Jelly",
    packId: "celestial",
    rarity: "common",
    dropRate: 17,
    description: "Floating star-cluster jellyfish emitting ethereal blue glow waves.",
    atk: 90,
    def: 140,
    element: "cosmic",
    iconName: "jellyfish",
  },
  {
    id: "comet_fox",
    name: "Comet Fox",
    packId: "celestial",
    rarity: "common",
    dropRate: 17,
    description: "Swift starlight fox trailing sparkling stardust behind its twin tails.",
    atk: 135,
    def: 85,
    element: "cosmic",
    iconName: "fox",
  },
  {
    id: "astro_cat",
    name: "Astro Cat",
    packId: "celestial",
    rarity: "common",
    dropRate: 17,
    description: "Curious zero-gravity feline wearing a mini star-suit.",
    atk: 115,
    def: 110,
    element: "cosmic",
    iconName: "cat",
  },
  {
    id: "starlight_pegasus",
    name: "Starlight Pegasus",
    packId: "celestial",
    rarity: "rare",
    dropRate: 10,
    description: "Noble winged horse that soars across constellation paths.",
    atk: 240,
    def: 210,
    element: "cosmic",
    iconName: "pegasus",
  },
  {
    id: "moon_owl",
    name: "Moon Owl",
    packId: "celestial",
    rarity: "rare",
    dropRate: 10,
    description: "Wise nocturnal bird that channels lunar eclipse energy.",
    atk: 210,
    def: 250,
    element: "cosmic",
    iconName: "owl",
  },
  {
    id: "void_chimera",
    name: "Void Chimera",
    packId: "celestial",
    rarity: "epic",
    dropRate: 5,
    description: "Hybrid nightmare creature forged from deep space dark matter.",
    atk: 430,
    def: 310,
    element: "cosmic",
    iconName: "chimera",
  },
  {
    id: "galaxy_sentinel",
    name: "Galaxy Sentinel",
    packId: "celestial",
    rarity: "epic",
    dropRate: 5,
    description: "Armored star warrior protecting cosmic balance across galaxies.",
    atk: 380,
    def: 420,
    element: "cosmic",
    iconName: "sentinel",
  },
  {
    id: "eclipse_wyrm",
    name: "Eclipse Wyrm",
    packId: "celestial",
    rarity: "legendary",
    dropRate: 1.9,
    description: "Colossal dragon that feeds on solar energy during full celestial eclipses.",
    atk: 700,
    def: 610,
    element: "cosmic",
    iconName: "wyrm_cosmic",
  },
  {
    id: "astrion",
    name: "Astrion",
    packId: "celestial",
    rarity: "mythic",
    dropRate: 0.1,
    description: "Cosmic Sovereign Dragon woven from galaxy filaments and infinite star cores.",
    atk: 1000,
    def: 920,
    element: "cosmic",
    iconName: "dragon_astrion",
  },

  // --- PACK 4: ANCIENT WILDS PACK ---
  {
    id: "vine_viper",
    name: "Vine Viper",
    packId: "wilds",
    rarity: "common",
    dropRate: 17,
    description: "Camouflaged jungle snake disguised as enchanted hanging ivy.",
    atk: 125,
    def: 85,
    element: "nature",
    iconName: "vine_snake",
  },
  {
    id: "mossy_toad",
    name: "Mossy Toad",
    packId: "wilds",
    rarity: "common",
    dropRate: 17,
    description: "Stout forest amphibian covered in protective glowing moss.",
    atk: 80,
    def: 160,
    element: "nature",
    iconName: "toad",
  },
  {
    id: "forest_monkey",
    name: "Forest Monkey",
    packId: "wilds",
    rarity: "common",
    dropRate: 17,
    description: "Acrobatic canopy acrobat that throws enchanted acorn bombs.",
    atk: 115,
    def: 100,
    element: "nature",
    iconName: "monkey",
  },
  {
    id: "leaf_beetle",
    name: "Leaf Beetle",
    packId: "wilds",
    rarity: "common",
    dropRate: 17,
    description: "Tiny armored insect carrying a sharp razor-leaf shield.",
    atk: 95,
    def: 145,
    element: "nature",
    iconName: "leaf_insect",
  },
  {
    id: "saber_tooth",
    name: "Saber Tooth Tiger",
    packId: "wilds",
    rarity: "rare",
    dropRate: 10,
    description: "Ice age feline with massive piercing fangs and deadly pounce speed.",
    atk: 270,
    def: 180,
    element: "nature",
    iconName: "tiger",
  },
  {
    id: "giant_falcon",
    name: "Giant Falcon",
    packId: "wilds",
    rarity: "rare",
    dropRate: 10,
    description: "High-flying sky predator with gale-force wing gusts.",
    atk: 245,
    def: 195,
    element: "nature",
    iconName: "falcon",
  },
  {
    id: "wild_behemoth",
    name: "Wild Behemoth",
    packId: "wilds",
    rarity: "epic",
    dropRate: 5,
    description: "Massive primeval beast that shakes the earth with every step.",
    atk: 450,
    def: 370,
    element: "nature",
    iconName: "behemoth",
  },
  {
    id: "spirit_wolf",
    name: "Spirit Wolf",
    packId: "wilds",
    rarity: "epic",
    dropRate: 5,
    description: "Ethereal forest alpha wolf leading a phantom pack in twilight.",
    atk: 400,
    def: 330,
    element: "nature",
    iconName: "wolf",
  },
  {
    id: "mammoth_titan",
    name: "Mammoth Titan",
    packId: "wilds",
    rarity: "legendary",
    dropRate: 1.9,
    description: "Colossal prehistoric mammoth with impenetrable icy tusk armor.",
    atk: 670,
    def: 690,
    element: "nature",
    iconName: "mammoth",
  },
  {
    id: "sylvargon",
    name: "Sylvargon",
    packId: "wilds",
    rarity: "mythic",
    dropRate: 0.1,
    description: "Primordial Forest Dragon draped in emerald runes and ancient roots.",
    atk: 960,
    def: 950,
    element: "nature",
    iconName: "dragon_sylvargon",
  },
];

// Local storage key for card inventory
const CARD_INVENTORY_KEY = "unlimited_learning_cards";

export function getUserCards(userId?: string): Record<string, InventoryCard> {
  const key = userId ? `${CARD_INVENTORY_KEY}_${userId}` : CARD_INVENTORY_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to load user card inventory:", e);
  }
  return {};
}

export function saveUserCards(inventory: Record<string, InventoryCard>, userId?: string) {
  const key = userId ? `${CARD_INVENTORY_KEY}_${userId}` : CARD_INVENTORY_KEY;
  try {
    localStorage.setItem(key, JSON.stringify(inventory));
    window.dispatchEvent(new CustomEvent("mathmaster:cards-updated", { detail: inventory }));
  } catch (e) {
    console.warn("Failed to save user cards:", e);
  }
}

export function addCardToInventory(cardId: string, userId?: string): { card: Card; isNew: boolean; count: number } {
  const inventory = getUserCards(userId);
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) throw new Error("Card not found");

  const existing = inventory[cardId];
  const isNew = !existing;
  const count = (existing?.count || 0) + 1;

  inventory[cardId] = {
    cardId,
    count,
    firstUnlockedAt: existing?.firstUnlockedAt || new Date().toISOString(),
  };

  saveUserCards(inventory, userId);
  return { card, isNew, count };
}

// Drop algorithm enforcing exact weighted probabilities:
// Commons: 14% each x 4 = 56%
// Rares: 10% each x 2 = 20%
// Epics: 6% each x 2 = 12%
// Legendary: ~9.5%
// Mythic: 2.5% (1 in 40 chance)
export function pullCardFromPack(packId: string): Card {
  const packCards = CARDS.filter((c) => c.packId === packId);
  if (packCards.length === 0) throw new Error("No cards in pack");

  // Dynamically compute total weight to guarantee 100% reachability for all cards
  const totalWeight = packCards.reduce((sum, card) => sum + (card.dropRate || 1), 0);

  const rand = Math.random() * totalWeight;
  let cumulative = 0;

  for (const card of packCards) {
    cumulative += card.dropRate || 1;
    if (rand < cumulative) {
      return card;
    }
  }

  // Fallback return last card
  return packCards[packCards.length - 1];
}

export function getPackCards(packId: string): Card[] {
  return CARDS.filter((c) => c.packId === packId);
}

export function getCardById(cardId: string): Card | undefined {
  return CARDS.find((c) => c.id === cardId);
}
