import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import ProgressRing from "../components/ProgressRing";
import Modal from "../components/Modal";
import { getLocalProgress, claimBadgeCoins, getCoins } from "../lib/progress";
import { getAllSubtopicMeta } from "../lib/quiz/core";
import {
  ALL_BADGES,
  TIER_CONFIG,
  type BadgeDefinition,
  type BadgeTier,
  type UserBadgeStats,
} from "../lib/badges";
import {
  Award,
  BookOpen,
  Clock,
  Flame,
  Lock,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────
interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  xp_total: number;
  level: number;
}

interface TopicProgress {
  topic_name: string;
  topic_color: string;
  topic_slug: string;
  total: number;
  mastered: number;
  in_progress: number;
}

interface RecentAttempt {
  id: string;
  score: number;
  total: number;
  passed: boolean;
  duration_seconds: number | null;
  created_at: string;
  subtopic_name: string;
  topic_name: string;
  topic_color: string;
}

// ── XP helpers ───────────────────────────────────────────
function xpForLevel(lvl: number) { return 50 * lvl * lvl; }
function xpProgress(xp: number, level: number) {
  const start = xpForLevel(level);
  const next  = xpForLevel(level + 1);
  if (next <= start) return 100;
  return Math.min(((xp - start) / (next - start)) * 100, 100);
}

// ── Skeleton ─────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-xl ${className ?? ""}`} />;
}

// ── StatCard ─────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color ?? "#4A7CF7"}1A` }}
      >
        <span style={{ color: color ?? "#4A7CF7" }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">{label}</p>
        <p className="font-heading text-2xl font-bold text-foreground leading-tight">{value}</p>
        {sub && <p className="text-xs text-foreground/50 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main Dashboard Component ─────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();

  const [streak, setStreak]         = useState<StreakData | null>(null);
  const [topics, setTopics]         = useState<TopicProgress[] | null>(null);
  const [recent, setRecent]         = useState<RecentAttempt[] | null>(null);
  const [coins, setCoins]           = useState<number>(0);
  const [username, setUsername]     = useState<string>("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // Badge state
  const [activeTierFilter, setActiveTierFilter] = useState<BadgeTier | "all">("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setError(null);
    const userId = user?.id;

    try {
      const [
        { data: streakData },
        { data: progressData },
        { data: recentData },
        { data: userData },
      ] = await Promise.all([
        userId ? supabase.from("user_streaks").select("*").eq("user_id", userId).single() : Promise.resolve({ data: null }),
        userId ? supabase.from("user_progress").select("status, subtopics(id, depth, topic_id, topics(name, slug, color))").eq("user_id", userId) : Promise.resolve({ data: null }),
        userId ? supabase.from("quiz_attempts").select("id, score, total, passed, duration_seconds, created_at, subtopics(name, topics(name, color))").eq("user_id", userId).order("created_at", { ascending: false }).limit(6) : Promise.resolve({ data: null }),
        userId ? supabase.from("users").select("username").eq("id", userId).single() : Promise.resolve({ data: null }),
      ]);

      setStreak(streakData ?? { current_streak: 1, longest_streak: 1, last_active_date: null, xp_total: 0, level: 0 });
      setUsername(userData?.username ?? "");
      setCoins(getCoins(userId));

      // Local progress sync
      const localProg = getLocalProgress(userId);
      const allMeta = getAllSubtopicMeta();

      // Build per-topic summary
      const topicMap = new Map<string, TopicProgress>();

      allMeta.forEach((m) => {
        if (!topicMap.has(m.topicSlug)) {
          topicMap.set(m.topicSlug, {
            topic_name: m.topicName,
            topic_color: m.topicColor,
            topic_slug: m.topicSlug,
            total: 0,
            mastered: 0,
            in_progress: 0,
          });
        }
        const entry = topicMap.get(m.topicSlug)!;
        entry.total++;
        const localStat = localProg.subtopicStatuses[m.slug];
        if (localStat === "mastered") entry.mastered++;
        else if (localStat === "in_progress") entry.in_progress++;
      });

      // Merge DB progress
      (progressData ?? []).forEach((p: any) => {
        const sub   = p.subtopics as any;
        const topic = sub?.topics as any;
        if (!topic) return;
        const key = topic.slug;
        if (!topicMap.has(key)) {
          topicMap.set(key, { topic_name: topic.name, topic_color: topic.color, topic_slug: topic.slug, total: 0, mastered: 0, in_progress: 0 });
        }
        const entry = topicMap.get(key)!;
        if (p.status === "mastered" && localProg.subtopicStatuses[sub.slug] !== "mastered") {
          entry.mastered++;
        } else if (p.status === "in_progress" && !localProg.subtopicStatuses[sub.slug]) {
          entry.in_progress++;
        }
      });

      setTopics(Array.from(topicMap.values()));

      // Recent attempts
      const mapped: RecentAttempt[] = (recentData ?? []).map((a: any) => ({
        id: a.id,
        score: a.score,
        total: a.total,
        passed: a.passed,
        duration_seconds: a.duration_seconds,
        created_at: a.created_at,
        subtopic_name: a.subtopics?.name ?? "Quiz",
        topic_name:    a.subtopics?.topics?.name ?? "",
        topic_color:   a.subtopics?.topics?.color ?? "#4A7CF7",
      }));
      setRecent(mapped);
    } catch {
      setError("Couldn't load your dashboard. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboard();
    const handleProgress = () => loadDashboard();
    window.addEventListener("mathmaster:progress-updated", handleProgress);
    window.addEventListener("mathmaster:coins-updated", handleProgress);
    return () => {
      window.removeEventListener("mathmaster:progress-updated", handleProgress);
      window.removeEventListener("mathmaster:coins-updated", handleProgress);
    };
  }, [loadDashboard]);

  // Derive User Badge Stats
  const localProg = getLocalProgress(user?.id);
  const userStats: UserBadgeStats = {
    totalQuizzes: localProg.quizHistory.length,
    coreQuizzes: localProg.quizHistory.filter(q => q.difficulty === "core").length,
    intermediateQuizzes: localProg.quizHistory.filter(q => q.difficulty === "intermediate").length,
    advancedQuizzes: localProg.quizHistory.filter(q => q.difficulty === "advanced").length,
    masteryQuizzes: localProg.quizHistory.filter(q => q.difficulty === "mastery").length,
    masteredSubtopicsCount: Object.values(localProg.subtopicStatuses).filter(s => s === "mastered").length,
    masteredTopicsCount: Object.values(localProg.masteredTopics).filter(Boolean).length,
    currentStreak: Math.max(streak?.current_streak ?? 1, 1),
    perfectQuizzesCount: localProg.quizHistory.filter(q => q.score === q.total && q.total > 0).length,
    fast100QuizCount: localProg.quizHistory.filter(q => q.score === q.total && q.total > 0 && q.durationSeconds <= 60).length,
    masteredMathTopicsCount: ["algebra-1", "geometry", "algebra-2", "calculus"].filter(slug => localProg.masteredTopics[slug]).length,
  };

  const handleClaimCoins = (badge: BadgeDefinition) => {
    const res = claimBadgeCoins(badge.id, badge.rewardCoins, user?.id);
    if (res.success) {
      setCoins(res.newTotal);
      setClaimedNotice(`🎉 Claimed +${badge.rewardCoins} Coins for ${badge.title}!`);
      setTimeout(() => setClaimedNotice(null), 4000);
      loadDashboard();
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-10 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <button onClick={loadDashboard} className="btn-primary mt-4">Retry</button>
      </div>
    );
  }

  const level   = streak?.level ?? 0;
  const xp      = streak?.xp_total ?? 0;
  const prog    = xpProgress(xp, level);
  const xpToNext = xpForLevel(level + 1) - xp;

  const totalMastered  = Object.values(localProg.subtopicStatuses).filter(s => s === "mastered").length;
  const totalSubtopics = topics?.reduce((s, t) => s + t.total, 0) ?? 0;

  // Filtered badges
  const displayedBadges = ALL_BADGES.filter((b) =>
    activeTierFilter === "all" ? true : b.tier === activeTierFilter
  );

  return (
    <div className="space-y-8">

      {/* Claimed Toast Notice */}
      <AnimatePresence>
        {claimedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-amber-500 text-slate-950 font-heading font-bold text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-amber-300"
          >
            <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>{claimedNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {username ? `Hey, ${username}! 👋` : "Your Dashboard"}
        </h1>
        <p className="mt-1 text-foreground/60">Here's how your learning journey is going.</p>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div
        className="grid gap-4 grid-cols-2 sm:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {[
          { icon: <Flame className="w-5 h-5" />, label: "Current Streak", value: `${userStats.currentStreak}d`, sub: `Best: ${streak?.longest_streak ?? 1} days`, color: "#FF4500" },
          { icon: <Zap className="w-5 h-5" />,   label: "Total XP",        value: `${xp.toLocaleString()}`, sub: `Level ${level}`, color: "#FFD700" },
          { icon: <span className="text-xl">🪙</span>, label: "Coins Balance", value: coins, sub: "Earn by mastering & badges", color: "#F59E0B" },
          { icon: <Star className="w-5 h-5" />,  label: "Mastered",        value: totalMastered, sub: `of ${totalSubtopics} subtopics`, color: "#22C55E" },
        ].map((s, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Level / XP Bar ── */}
      <motion.div className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-heading font-bold text-sm">
              {level}
            </span>
            <span className="font-heading font-semibold text-foreground">Level {level}</span>
          </div>
          <span className="text-sm text-foreground/60 font-medium">{xpToNext} XP to Level {level + 1}</span>
        </div>
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${prog}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
        </div>
        <p className="mt-2 text-xs text-foreground/40 text-right">{xp.toLocaleString()} / {xpForLevel(level + 1).toLocaleString()} XP</p>
      </motion.div>

      {/* ── Topic Progress ── */}
      {(topics?.length ?? 0) > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Topic Progress
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {topics!.map((t, i) => {
              const pct = t.total === 0 ? 0 : (t.mastered / t.total) * 100;
              return (
                <motion.div
                  key={t.topic_slug}
                  className="card p-4 flex items-center gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <ProgressRing percent={pct} color={t.topic_color} size={56} />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground truncate">{t.topic_name}</p>
                    <p className="text-sm text-foreground/60">{t.mastered} of {t.total} mastered</p>
                    {t.in_progress > 0 && (
                      <p className="text-xs text-accent font-medium mt-0.5">{t.in_progress} in progress</p>
                    )}
                  </div>
                  <Link
                    to={`/learn`}
                    className="text-xs font-semibold text-primary hover:underline shrink-0"
                  >
                    Study →
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── BADGES SHOWCASE ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Badges & Achievements
            </h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Click badges to see requirements. Unlocked badges earn you coins!
            </p>
          </div>

          {/* Tier Filters */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-muted rounded-xl">
            {(["all", "common", "rare", "epic", "legendary"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTierFilter(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                  activeTierFilter === tier
                    ? "bg-card shadow-sm text-primary font-bold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tier === "all"
                  ? "All"
                  : `${tier.charAt(0).toUpperCase() + tier.slice(1)} (+${TIER_CONFIG[tier].coins}🪙)`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {displayedBadges.map((badge, i) => {
            const isUnlocked = badge.checkUnlocked(userStats);
            const isClaimed = !!localProg.claimedBadges[badge.id];
            const config = TIER_CONFIG[badge.tier];

            return (
              <motion.button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * i }}
                className={`relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer group hover:scale-[1.02] flex flex-col justify-between ${config.glow} ${
                  isUnlocked
                    ? config.badgeBg + " " + config.border
                    : "bg-muted/40 border-border text-foreground/40"
                }`}
              >
                {/* Header Badge Pill */}
                <div className="flex items-center justify-between mb-3 w-full">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider"
                    style={{ backgroundColor: `${config.color}22`, color: config.color }}
                  >
                    {config.label}
                  </span>

                  <span className="text-xs font-bold font-heading flex items-center gap-0.5 text-amber-500">
                    +{config.coins}🪙
                  </span>
                </div>

                {/* Badge Icon (Hidden if locked!) */}
                <div className="my-3 flex items-center justify-center">
                  {isUnlocked ? (
                    <div className="w-14 h-14 rounded-2xl bg-card shadow-md flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {badge.emoji}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-muted/80 border border-border flex flex-col items-center justify-center text-foreground/40 group-hover:border-primary/50 transition-colors">
                      <Lock className="w-6 h-6" />
                      <span className="text-[10px] font-mono mt-0.5">LOCKED</span>
                    </div>
                  )}
                </div>

                {/* Title & Status */}
                <div className="text-center w-full mt-1">
                  <p className="font-heading font-bold text-sm truncate">
                    {badge.title}
                  </p>
                  <p className="text-[11px] opacity-70 mt-0.5 truncate">
                    {isUnlocked
                      ? isClaimed
                        ? "Claimed 🪙"
                        : "Click to Claim!"
                      : "Click for info"}
                  </p>
                </div>

                {/* Unclaimed Glow Banner */}
                {isUnlocked && !isClaimed && (
                  <div className="mt-2 w-full text-center py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-heading font-bold animate-pulse shadow-sm">
                    Claim +{config.coins}🪙
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Badge Detail Modal ── */}
      {selectedBadge && (
        <Modal
          open={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
          title={selectedBadge.title}
        >
          {(() => {
            const isUnlocked = selectedBadge.checkUnlocked(userStats);
            const isClaimed = !!localProg.claimedBadges[selectedBadge.id];
            const config = TIER_CONFIG[selectedBadge.tier];

            return (
              <div className="space-y-5 text-center py-2">
                {/* Large Icon Box */}
                <div className="flex justify-center">
                  {isUnlocked ? (
                    <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-4xl shadow-lg">
                      {selectedBadge.emoji}
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-3xl bg-muted border-2 border-border flex items-center justify-center text-foreground/40">
                      <Lock className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Title & Tier */}
                <div>
                  <div className="flex justify-center gap-2 mb-1">
                    <span
                      className="px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider"
                      style={{ backgroundColor: `${config.color}22`, color: config.color }}
                    >
                      {config.label} Tier (+{config.coins} Coins)
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {selectedBadge.title}
                  </h3>
                </div>

                {/* Requirement Description */}
                <div className="card p-4 text-left bg-muted/30">
                  <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-1">
                    Achievement Requirement:
                  </p>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {selectedBadge.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {isUnlocked ? (
                    isClaimed ? (
                      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-heading font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        Reward Claimed (+{selectedBadge.rewardCoins} Coins)
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          handleClaimCoins(selectedBadge);
                          setSelectedBadge(null);
                        }}
                        className="btn-primary w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg py-3 flex items-center justify-center gap-2 text-base cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5" />
                        Claim +{selectedBadge.rewardCoins} Coins Now!
                      </button>
                    )
                  ) : (
                    <div className="p-3 bg-muted rounded-xl text-xs font-medium text-foreground/60 flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4 text-foreground/40" />
                      Locked — Complete the requirement above to earn +{selectedBadge.rewardCoins} Coins.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* ── Recent Quizzes ── */}
      {(recent?.length ?? 0) > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Recent Quizzes
          </h2>
          <div className="card overflow-hidden divide-y divide-border">
            {recent!.map((a) => {
              const pct = Math.round((a.score / a.total) * 100);
              const mins = a.duration_seconds ? Math.floor(a.duration_seconds / 60) : null;
              const secs = a.duration_seconds ? a.duration_seconds % 60 : null;
              return (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: a.passed ? "#22C55E" : "#EF4444" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.subtopic_name}</p>
                    <p className="text-xs text-foreground/50">{a.topic_name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-sm font-heading font-bold"
                      style={{ color: a.passed ? "#22C55E" : "#EF4444" }}
                    >
                      {pct}%
                    </p>
                    {mins !== null && (
                      <p className="text-xs text-foreground/40 flex items-center gap-0.5 justify-end">
                        <Clock className="w-3 h-3" />
                        {mins}m {secs}s
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
