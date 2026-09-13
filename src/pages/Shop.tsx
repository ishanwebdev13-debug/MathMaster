import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  PACKS,
  CARDS,
  type Card,
  type Pack,
  getUserCards,
  addCardToInventory,
  pullCardFromPack,
  RARITY_CONFIG,
} from "../lib/cards";
import {
  getCoins,
  deductCoins,
  addCoins,
  setCoins,
  setShark67Unlocked,
  setInfiniteCoinsEnabled,
  getLocalProgress,
} from "../lib/progress";
import GameCard from "../components/GameCard";
import {
  Coins,
  Sparkles,
  ShoppingBag,
  Layers,
  Info,
  RotateCcw,
  Star,
  Lock,
  Unlock,
  Key,
  Sliders,
  Wand2,
  Eye,
  CheckCircle2,
  Zap,
  Package,
  Plus,
} from "lucide-react";

export default function Shop() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"shop" | "collection">("shop");
  const [coins, setCoinsState] = useState<number>(() => getCoins(user?.id));
  const [inventory, setInventory] = useState(() => getUserCards(user?.id));

  // Progress state for initial coins and Shark67 cheat
  const [localProg, setLocalProg] = useState(() => getLocalProgress(user?.id));
  const [codeInputValue, setCodeInputValue] = useState("");
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [customCoinInput, setCustomCoinInput] = useState<string>("");

  // Pack Quantity State for Multi-Pack / Batch Opening
  const [packQuantity, setPackQuantity] = useState<number>(1);
  const [quantityInputStr, setQuantityInputStr] = useState<string>("1");

  // Batch / Multi-Pack Opening Results Modal
  const [batchResult, setBatchResult] = useState<{
    pack: Pack;
    countOpened: number;
    totalCost: number;
    uniquePulledCards: {
      card: Card;
      pulledCount: number;
      isNew: boolean;
      totalOwned: number;
    }[];
  } | null>(null);

  // Pack Contents Preview Modal (all cards up to epic visible, leg/mythic hidden)
  const [selectedPackForInfo, setSelectedPackForInfo] = useState<Pack | null>(null);

  // Filter state for Collection
  const [collectionPackFilter, setCollectionPackFilter] = useState<string>("all");
  const [collectionRarityFilter, setCollectionRarityFilter] = useState<string>("all");

  // Single card preview modal
  const [previewCard, setPreviewCard] = useState<Card | null>(null);

  // Refresh coins, inventory, and cheat progress
  const refreshUserData = () => {
    const p = getLocalProgress(user?.id);
    setLocalProg(p);
    setCoinsState(getCoins(user?.id));
    setInventory(getUserCards(user?.id));
  };

  useEffect(() => {
    refreshUserData();

    const handler = () => refreshUserData();
    window.addEventListener("mathmaster:coins-updated", handler);
    window.addEventListener("mathmaster:cards-updated", handler);
    window.addEventListener("mathmaster:progress-updated", handler);
    return () => {
      window.removeEventListener("mathmaster:coins-updated", handler);
      window.removeEventListener("mathmaster:cards-updated", handler);
      window.removeEventListener("mathmaster:progress-updated", handler);
    };
  }, [user?.id]);

  // Handle Multi-Pack / Batch Purchasing & Instant Summary
  const handleBatchBuyPack = (pack: Pack, count: number) => {
    const qty = Math.max(1, Math.floor(count));
    const totalCost = pack.price * qty;

    if (!localProg.infiniteCoinsEnabled && coins < totalCost) {
      alert(
        `You need ${totalCost.toLocaleString()} coins to purchase ${qty} ${pack.name}s! You currently have ${coins.toLocaleString()} coins.`
      );
      return;
    }

    const success = deductCoins(totalCost, user?.id);
    if (!success) return;

    refreshUserData();

    // Track results of batch pull
    const pullCountsMap: Record<string, { card: Card; pulledCount: number; isNew: boolean }> = {};

    for (let i = 0; i < qty; i++) {
      const pulledCard = pullCardFromPack(pack.id);
      const result = addCardToInventory(pulledCard.id, user?.id);

      if (!pullCountsMap[pulledCard.id]) {
        pullCountsMap[pulledCard.id] = {
          card: pulledCard,
          pulledCount: 1,
          isNew: result.isNew,
        };
      } else {
        pullCountsMap[pulledCard.id].pulledCount += 1;
        if (result.isNew) pullCountsMap[pulledCard.id].isNew = true;
      }
    }

    const latestInventory = getUserCards(user?.id);
    setInventory(latestInventory);

    // Sort by rarity rank order (Mythic -> Legendary -> Epic -> Rare -> Common)
    const rarityRank: Record<string, number> = {
      mythic: 5,
      legendary: 4,
      epic: 3,
      rare: 2,
      common: 1,
    };

    const uniquePulledCards = Object.values(pullCountsMap)
      .map((item) => ({
        card: item.card,
        pulledCount: item.pulledCount,
        isNew: item.isNew,
        totalOwned: latestInventory[item.card.id]?.count || item.pulledCount,
      }))
      .sort((a, b) => rarityRank[b.card.rarity] - rarityRank[a.card.rarity]);

    setBatchResult({
      pack,
      countOpened: qty,
      totalCost,
      uniquePulledCards,
    });
  };

  // Update Pack Quantity Selector
  const updateQuantity = (val: number) => {
    const validVal = Math.max(1, Math.floor(val));
    setPackQuantity(validVal);
    setQuantityInputStr(validVal.toString());
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setQuantityInputStr(valStr);
    const parsed = parseInt(valStr);
    if (!isNaN(parsed) && parsed >= 1) {
      setPackQuantity(parsed);
    }
  };

  // Handle Redeem Code "Shark67"
  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = codeInputValue.trim().toLowerCase();
    if (cleanCode === "shark67") {
      setShark67Unlocked(true, user?.id);
      setCodeMessage("🦈 SHARK67 UNLOCKED! Unlimited Coin Generator Enabled!");
      setCodeInputValue("");
      refreshUserData();
    } else {
      setCodeMessage("❌ Invalid code. Check spelling and try again.");
    }
  };

  // Handle Infinite Coins Toggle
  const handleToggleInfiniteCoins = () => {
    const nextVal = !localProg.infiniteCoinsEnabled;
    setInfiniteCoinsEnabled(nextVal, user?.id);
    refreshUserData();
  };

  // Calculate Collection Statistics
  const totalCardsCount = CARDS.length;
  const unlockedCardsCount = Object.keys(inventory).length;
  const completionPercentage = Math.round((unlockedCardsCount / totalCardsCount) * 100);

  // Filtered Cards for Binder
  const filteredCards = CARDS.filter((card) => {
    if (collectionPackFilter !== "all" && card.packId !== collectionPackFilter) return false;
    if (collectionRarityFilter !== "all" && card.rarity !== collectionRarityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 border border-purple-500/40 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-heading text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Bonus: 1,000 Initial Free Coins!
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white drop-shadow">
              Card Shop & Collection
            </h1>
            <p className="text-purple-200/90 text-sm max-w-xl">
              Open 30-Coin OG Packs! Select exact quantities to open instantly, inspect pack cards, and collect rare creatures & mythical dragons.
            </p>
          </div>

          {/* Balance Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-lg animate-pulse">
                🪙
              </div>
              <div>
                <div className="text-xs font-medium text-amber-200/70 uppercase tracking-wider">
                  Your Balance
                </div>
                <div className="text-2xl font-heading font-black text-amber-300 flex items-center gap-2">
                  <span>{localProg.infiniteCoinsEnabled ? "∞ (UNLIMITED)" : coins.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-amber-400">Coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECRET CODE "SHARK67" REDEEM SECTION ================= */}
      {!localProg.shark67Unlocked ? (
        <div className="rounded-2xl bg-slate-900/90 border border-purple-500/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm">Have a User Code?</h4>
              <p className="text-xs text-purple-200/70">Redeem secret creator & dev codes for rewards</p>
            </div>
          </div>

          <form onSubmit={handleRedeemCode} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder='Enter code e.g. "Shark67"'
              value={codeInputValue}
              onChange={(e) => setCodeInputValue(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-56"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-bold text-xs shadow-md whitespace-nowrap cursor-pointer"
            >
              Redeem Code
            </button>
          </form>

          {codeMessage && (
            <div className="text-xs font-heading font-semibold text-amber-300 w-full text-center sm:text-left">
              {codeMessage}
            </div>
          )}
        </div>
      ) : (
        /* ================= SHARK67 DEV / UNLIMITED COINS PANEL ================= */
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 border-2 border-cyan-400/60 p-5 text-white shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-cyan-500/30 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl shadow-lg">
                🦈
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-lg text-cyan-300 tracking-wide">
                    SHARK67 UNLIMITED COIN CONTROLS
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-heading text-[10px] font-extrabold uppercase">
                    ACTIVE DEV CODE
                  </span>
                </div>
                <p className="text-xs text-cyan-100/70">
                  You unlocked custom coin generation & unlimited coin toggles with code "Shark67"!
                </p>
              </div>
            </div>

            {/* Infinite Toggle Switch */}
            <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-cyan-500/40">
              <span className="text-xs font-heading font-bold text-cyan-200">
                Infinite Coins Mode:
              </span>
              <button
                onClick={handleToggleInfiniteCoins}
                className={`relative w-14 h-7 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  localProg.infiniteCoinsEnabled ? "bg-cyan-500 justify-end" : "bg-slate-700 justify-start"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[10px] font-black text-slate-900">
                  {localProg.infiniteCoinsEnabled ? "ON" : "OFF"}
                </div>
              </button>
            </div>
          </div>

          {/* Quick Coin Generator Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs font-heading font-bold text-purple-200">Quick Add Coins:</span>
            <button
              onClick={() => {
                addCoins(1000, user?.id);
                refreshUserData();
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-400/40 text-purple-200 font-heading font-bold text-xs transition-transform active:scale-95 cursor-pointer"
            >
              +1,000 Coins
            </button>
            <button
              onClick={() => {
                addCoins(10000, user?.id);
                refreshUserData();
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-400/40 text-purple-200 font-heading font-bold text-xs transition-transform active:scale-95 cursor-pointer"
            >
              +10,000 Coins
            </button>
            <button
              onClick={() => {
                addCoins(100000, user?.id);
                refreshUserData();
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-400/40 text-purple-200 font-heading font-bold text-xs transition-transform active:scale-95 cursor-pointer"
            >
              +100,000 Coins
            </button>

            {/* Custom Input */}
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="number"
                placeholder="Custom coin amount"
                value={customCoinInput}
                onChange={(e) => setCustomCoinInput(e.target.value)}
                className="w-36 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-400/40 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-300"
              />
              <button
                onClick={() => {
                  const val = parseInt(customCoinInput);
                  if (!isNaN(val) && val >= 0) {
                    setCoins(val, user?.id);
                    refreshUserData();
                    setCustomCoinInput("");
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-extrabold text-xs shadow-md cursor-pointer"
              >
                Set Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("shop")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all cursor-pointer ${
              activeTab === "shop"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Card Shop</span>
          </button>

          <button
            onClick={() => setActiveTab("collection")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all cursor-pointer ${
              activeTab === "collection"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Collection</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-foreground/20 text-xs font-extrabold">
              {unlockedCardsCount}/{totalCardsCount}
            </span>
          </button>
        </div>

        {/* Collection Progress Bar */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="font-heading font-semibold text-foreground/70">
            Collection: {completionPercentage}%
          </span>
          <div className="w-32 h-2.5 bg-muted rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= TAB 1: CARD SHOP ================= */}
      {activeTab === "shop" && (
        <div className="space-y-6">
          {/* MULTI-PACK OPENING QUANTITY SELECTOR BAR */}
          <div className="rounded-2xl bg-card border border-border p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-500">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                  <span>Pack Quantity Selector</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 font-mono text-[10px]">
                    Instant Bulk Pull
                  </span>
                </h3>
                <p className="text-xs text-foreground/70">
                  Type or select how many packs you want to open at once for an instant summary!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-heading font-bold text-foreground/70">Quantity:</span>
              
              {/* Preset Buttons */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
                {[1, 5, 10, 25, 50, 100].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => updateQuantity(qty)}
                    className={`px-2.5 py-1 rounded-lg font-heading font-extrabold text-xs transition-all cursor-pointer ${
                      packQuantity === qty
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-foreground/70 hover:bg-background hover:text-foreground"
                    }`}
                  >
                    {qty}x
                  </button>
                ))}
              </div>

              {/* Custom Number Input */}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantityInputStr}
                  onChange={handleQuantityInputChange}
                  className="w-20 px-2.5 py-1 rounded-xl bg-background border border-border text-foreground font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                />
                <span className="text-xs text-foreground/60 font-medium">packs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span>Original Card Packs</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                4 OG Packs
              </span>
            </h2>
            <p className="text-xs text-foreground/60 font-medium">
              30 Coins / Pack • Opening <span className="font-extrabold text-amber-500 font-mono text-sm">{packQuantity}</span> {packQuantity === 1 ? "pack" : "packs"} ({30 * packQuantity} Coins)
            </p>
          </div>

          {/* Grid of 4 OG Realistic Packs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKS.map((pack) => {
              const packCards = CARDS.filter((c) => c.packId === pack.id);
              const mythicCard = packCards.find((c) => c.rarity === "mythic");
              const totalCost = pack.price * packQuantity;
              const canAfford = localProg.infiniteCoinsEnabled || coins >= totalCost;

              return (
                <div
                  key={pack.id}
                  className={`group relative rounded-3xl bg-gradient-to-b ${pack.bgGradient} border-2 border-white/20 p-5 flex flex-col justify-between text-white shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-cyan-500/20 overflow-hidden`}
                >
                  {/* Realistic Foil Packaging Glare & Tear Strip */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />

                  <div className="w-full text-center pb-2 mb-2 border-b border-dashed border-white/30 text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase flex items-center justify-center gap-1">
                    <span>✂ TEAR HERE TO OPEN ✂</span>
                  </div>

                  {/* Pack Icon Banner & Header */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-5xl drop-shadow-[0_5px_10px_rgba(0,0,0,0.6)] transform group-hover:scale-110 transition-transform">
                        {pack.bannerIcon}
                      </span>
                      <button
                        onClick={() => setSelectedPackForInfo(pack)}
                        className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs border border-white/20 transition-colors cursor-pointer flex items-center gap-1"
                        title="View Pack Cards"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Inspect</span>
                      </button>
                    </div>

                    <div>
                      <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-cyan-300">
                        {pack.tagline}
                      </div>
                      <h3 className="text-2xl font-heading font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {pack.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-200/90 leading-relaxed font-medium min-h-[3rem]">
                      {pack.description}
                    </p>

                    {/* Featured Mythic Badge */}
                    {mythicCard && (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-pink-500/50 text-xs font-heading font-bold text-pink-300 flex items-center gap-2 shadow-inner">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                        <span className="truncate">Mythic: {mythicCard.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Pack Footer / Buy Button */}
                  <div className="relative z-10 pt-6 space-y-3">
                    <button
                      onClick={() => handleBatchBuyPack(pack, packQuantity)}
                      disabled={!canAfford}
                      className={`w-full py-3 px-4 rounded-2xl font-heading font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer ${
                        canAfford
                          ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-amber-500/30"
                          : "bg-slate-800/80 text-slate-400 border border-slate-700 cursor-not-allowed"
                      }`}
                    >
                      <Coins className="w-4 h-4 text-slate-950" />
                      <span>
                        Open {packQuantity} {packQuantity === 1 ? "Pack" : "Packs"} ({totalCost.toLocaleString()} Coins)
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY COLLECTION ================= */}
      {activeTab === "collection" && (
        <div className="space-y-6">
          {/* Collection Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-heading font-bold text-foreground/70 uppercase tracking-wider">
                Filter Pack:
              </span>
              <select
                value={collectionPackFilter}
                onChange={(e) => setCollectionPackFilter(e.target.value)}
                className="bg-background text-foreground border border-border text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Packs (40 Cards)</option>
                {PACKS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <span className="text-xs font-heading font-bold text-foreground/70 uppercase tracking-wider ml-2">
                Rarity:
              </span>
              <select
                value={collectionRarityFilter}
                onChange={(e) => setCollectionRarityFilter(e.target.value)}
                className="bg-background text-foreground border border-border text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common (17%)</option>
                <option value="rare">Rare (10%)</option>
                <option value="epic">Epic (5%)</option>
                <option value="legendary">Legendary (1.9%)</option>
                <option value="mythic">Mythic (0.1%)</option>
              </select>
            </div>

            <div className="text-xs text-foreground/60 font-medium">
              Showing {filteredCards.length} cards
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCards.map((card) => {
              const invItem = inventory[card.id];
              const isUnlocked = !!invItem;

              return (
                <div key={card.id} className="flex justify-center">
                  <GameCard
                    card={card}
                    count={invItem?.count || 0}
                    isLocked={!isUnlocked}
                    onClick={() => isUnlocked && setPreviewCard(card)}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= BATCH / MULTI-PACK RESULTS MODAL ================= */}
      {batchResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 text-white shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce">{batchResult.pack.bannerIcon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-black text-xl text-amber-300">
                      Opened {batchResult.countOpened} {batchResult.pack.name}s!
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                      {batchResult.totalCost.toLocaleString()} Coins
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/80">
                    Instant summary showing unique cards pulled and duplicate quantities.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setBatchResult(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Batch Statistics Summary Bar */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-950/80 border border-slate-700/60 p-3 rounded-2xl text-center">
                <div className="text-[10px] uppercase font-heading font-bold text-slate-400">Total Cards</div>
                <div className="text-xl font-heading font-black text-amber-300">{batchResult.countOpened}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-700/60 p-3 rounded-2xl text-center">
                <div className="text-[10px] uppercase font-heading font-bold text-slate-400">Unique Cards</div>
                <div className="text-xl font-heading font-black text-cyan-300">{batchResult.uniquePulledCards.length}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-700/60 p-3 rounded-2xl text-center">
                <div className="text-[10px] uppercase font-heading font-bold text-slate-400">New Collection Unlocks</div>
                <div className="text-xl font-heading font-black text-emerald-400">
                  {batchResult.uniquePulledCards.filter((c) => c.isNew).length}
                </div>
              </div>
            </div>

            {/* Grid of Unique Pulled Cards */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {batchResult.uniquePulledCards.map((item) => (
                  <div key={item.card.id} className="relative flex flex-col items-center">
                    {/* Quantity Pulled Badge */}
                    <div className="z-20 -mb-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-heading font-black text-xs shadow-lg border border-white/40 flex items-center gap-1 animate-pulse">
                      <span>PULLED x{item.pulledCount}</span>
                    </div>

                    <GameCard
                      card={item.card}
                      count={item.totalOwned}
                      isNew={item.isNew}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="border-t border-slate-800 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-purple-200/80">
                Cards have been saved to <span className="text-cyan-300 font-bold">My Collection</span>!
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setBatchResult(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs cursor-pointer"
                >
                  Done & Collect
                </button>
                <button
                  onClick={() => {
                    const p = batchResult.pack;
                    const qty = batchResult.countOpened;
                    setBatchResult(null);
                    handleBatchBuyPack(p, qty);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-heading font-black text-xs shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>
                    Open {batchResult.countOpened} More ({batchResult.pack.price * batchResult.countOpened} Coins)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PACK CONTENTS PREVIEW MODAL ================= */}
      {/* (Shows all cards up to Epic revealed, Legendary & Mythic HIDDEN) */}
      {selectedPackForInfo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-cyan-400/50 rounded-3xl p-6 text-white shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPackForInfo.bannerIcon}</span>
                <div>
                  <h3 className="font-heading font-black text-xl text-white flex items-center gap-2">
                    <span>{selectedPackForInfo.name} Contents</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      10 Cards Total
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300/80">
                    Cards up to Epic are revealed below. <span className="text-amber-300 font-bold">Legendary</span> & <span className="text-pink-400 font-bold">Mythic</span> cards are locked secrets!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPackForInfo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Pack Cards Preview Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CARDS.filter((c) => c.packId === selectedPackForInfo.id).map((card) => {
                  const isVisible = card.rarity === "common" || card.rarity === "rare" || card.rarity === "epic";

                  if (isVisible) {
                    return (
                      <div key={card.id} className="flex justify-center">
                        <GameCard card={card} size="sm" />
                      </div>
                    );
                  }

                  // Hidden Legendary & Mythic Cards!
                  return (
                    <div
                      key={card.id}
                      className="w-44 h-64 rounded-2xl bg-slate-950 border-2 border-slate-700 p-3 flex flex-col items-center justify-between text-center select-none shadow-2xl relative overflow-hidden group"
                    >
                      {/* Holographic Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-900 to-amber-900/30 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse" />

                      <div className="relative z-10 w-full flex justify-between items-center text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-heading font-extrabold uppercase border ${
                          card.rarity === "legendary" 
                            ? "bg-amber-500/20 text-amber-300 border-amber-400/50" 
                            : "bg-pink-500/20 text-pink-300 border-pink-400/50"
                        }`}>
                          {card.rarity === "legendary" ? "Legendary (1.9%)" : "Mythic (0.1%)"}
                        </span>
                      </div>

                      <div className="relative z-10 my-auto space-y-2 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border-2 border-slate-700 flex items-center justify-center text-3xl shadow-lg">
                          🔒
                        </div>
                        <div className="font-heading font-black text-sm text-slate-200 tracking-wide">
                          Hidden {card.rarity === "legendary" ? "Legendary" : "Mythic"}
                        </div>
                        <p className="text-[10px] text-slate-400 px-1 font-medium leading-tight">
                          Secret drop! Pull from {selectedPackForInfo.name} to discover.
                        </p>
                      </div>

                      <div className="relative z-10 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        ??? UNKNOWN SPECIES ???
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pack Buy Action Footer */}
            <div className="border-t border-slate-800 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                Official Drop Rates: <span className="text-slate-400 font-medium">Common 68% | Rare 20% | Epic 10% | Legendary 1.9% | Mythic 0.1%</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedPackForInfo(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    const packToBuy = selectedPackForInfo;
                    setSelectedPackForInfo(null);
                    handleBatchBuyPack(packToBuy, packQuantity);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-heading font-black text-xs shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Coins className="w-4 h-4 text-slate-950" />
                  <span>
                    Open {packQuantity} {packQuantity === 1 ? "Pack" : "Packs"} ({selectedPackForInfo.price * packQuantity} Coins)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SINGLE CARD PREVIEW MODAL ================= */}
      {previewCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-slate-900 border border-purple-500/40 rounded-3xl p-6 text-center text-white shadow-2xl space-y-5">
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex justify-center pt-2">
              <GameCard
                card={previewCard}
                count={inventory[previewCard.id]?.count || 1}
                size="lg"
              />
            </div>

            <button
              onClick={() => setPreviewCard(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs cursor-pointer"
            >
              Back to Collection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
