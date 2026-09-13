export type BadgeTier = "common" | "rare" | "epic" | "legendary";

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string; // The requirement text displayed when clicked
  tier: BadgeTier;
  rewardCoins: number;
  emoji: string;
  checkUnlocked: (stats: UserBadgeStats) => boolean;
}

export interface UserBadgeStats {
  totalQuizzes: number;
  coreQuizzes: number;
  intermediateQuizzes: number;
  advancedQuizzes: number;
  masteryQuizzes: number;
  masteredSubtopicsCount: number;
  masteredTopicsCount: number;
  currentStreak: number;
  perfectQuizzesCount: number;
  fast100QuizCount: number; // 100% quiz completed in under 60 seconds
  masteredMathTopicsCount: number; // Algebra 1, Geometry, Algebra 2, Calculus
}

export const TIER_CONFIG: Record<
  BadgeTier,
  { label: string; coins: number; color: string; badgeBg: string; border: string; glow: string }
> = {
  common: {
    label: "Common",
    coins: 30,
    color: "#94A3B8", // Slate
    badgeBg: "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
    glow: "shadow-sm",
  },
  rare: {
    label: "Rare",
    coins: 50,
    color: "#3B82F6", // Blue
    badgeBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200",
    border: "border-blue-400 dark:border-blue-600",
    glow: "shadow-blue-500/20 shadow-md",
  },
  epic: {
    label: "Epic",
    coins: 100,
    color: "#A855F7", // Purple
    badgeBg: "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200",
    border: "border-purple-400 dark:border-purple-600",
    glow: "shadow-purple-500/30 shadow-lg",
  },
  legendary: {
    label: "Legendary",
    coins: 200,
    color: "#EAB308", // Amber/Gold
    badgeBg: "bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 dark:from-amber-950 dark:via-yellow-900 dark:to-amber-900 text-amber-950 dark:text-amber-100",
    border: "border-2 border-amber-400 dark:border-amber-500",
    glow: "shadow-amber-500/40 shadow-xl ring-2 ring-amber-400/50",
  },
};

export const ALL_BADGES: BadgeDefinition[] = [
  // ── COMMON BADGES (30 coins) ──────────────────────────
  {
    id: "first_quiz",
    title: "First Steps",
    description: "Complete your very first quiz on Unlimited.",
    tier: "common",
    rewardCoins: 30,
    emoji: "🚀",
    checkUnlocked: (stats) => stats.totalQuizzes >= 1,
  },
  {
    id: "first_subtopic_mastery",
    title: "Subtopic Scholar",
    description: "Pass a Mastery Test and master your first subtopic.",
    tier: "common",
    rewardCoins: 30,
    emoji: "🎓",
    checkUnlocked: (stats) => stats.masteredSubtopicsCount >= 1,
  },
  {
    id: "core_completion",
    title: "Foundation Built",
    description: "Complete at least 1 Core level quiz.",
    tier: "common",
    rewardCoins: 30,
    emoji: "🌱",
    checkUnlocked: (stats) => stats.coreQuizzes >= 1,
  },
  {
    id: "good_start",
    title: "High Marks",
    description: "Score 80% or higher on any quiz.",
    tier: "common",
    rewardCoins: 30,
    emoji: "📝",
    checkUnlocked: (stats) => stats.totalQuizzes >= 1,
  },
  {
    id: "streak_2",
    title: "Daily Spark",
    description: "Maintain a 2-day active study streak.",
    tier: "common",
    rewardCoins: 30,
    emoji: "⚡",
    checkUnlocked: (stats) => stats.currentStreak >= 2,
  },

  // ── RARE BADGES (50 coins) ────────────────────────────
  {
    id: "perfect_score",
    title: "Sharpshooter",
    description: "Score 100% on any quiz.",
    tier: "rare",
    rewardCoins: 50,
    emoji: "💯",
    checkUnlocked: (stats) => stats.perfectQuizzesCount >= 1,
  },
  {
    id: "intermediate_warrior",
    title: "Intermediate Adventurer",
    description: "Complete 3 Intermediate level quizzes.",
    tier: "rare",
    rewardCoins: 50,
    emoji: "⚔️",
    checkUnlocked: (stats) => stats.intermediateQuizzes >= 3,
  },
  {
    id: "subtopics_5",
    title: "Knowledge Builder",
    description: "Master 5 subtopics across any subjects.",
    tier: "rare",
    rewardCoins: 50,
    emoji: "📚",
    checkUnlocked: (stats) => stats.masteredSubtopicsCount >= 5,
  },
  {
    id: "streak_5",
    title: "Consistent Learner",
    description: "Maintain a 5-day study streak.",
    tier: "rare",
    rewardCoins: 50,
    emoji: "🔥",
    checkUnlocked: (stats) => stats.currentStreak >= 5,
  },

  // ── EPIC BADGES (100 coins) ───────────────────────────
  {
    id: "topic_master_1",
    title: "Topic Conqueror",
    description: "Complete a Final Topic Mastery Test and master a full topic.",
    tier: "epic",
    rewardCoins: 100,
    emoji: "👑",
    checkUnlocked: (stats) => stats.masteredTopicsCount >= 1,
  },
  {
    id: "advanced_master",
    title: "Advanced Strategist",
    description: "Complete 5 Advanced level quizzes.",
    tier: "epic",
    rewardCoins: 100,
    emoji: "🧠",
    checkUnlocked: (stats) => stats.advancedQuizzes >= 5,
  },
  {
    id: "subtopics_12",
    title: "Polymath Scholar",
    description: "Master 12 subtopics across any subjects.",
    tier: "epic",
    rewardCoins: 100,
    emoji: "✨",
    checkUnlocked: (stats) => stats.masteredSubtopicsCount >= 12,
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Finish a quiz in under 60 seconds with a 100% score.",
    tier: "epic",
    rewardCoins: 100,
    emoji: "⚡",
    checkUnlocked: (stats) => stats.fast100QuizCount >= 1,
  },
  {
    id: "streak_7",
    title: "Week-long Flame",
    description: "Maintain a 7-day active study streak.",
    tier: "epic",
    rewardCoins: 100,
    emoji: "🌟",
    checkUnlocked: (stats) => stats.currentStreak >= 7,
  },

  // ── LEGENDARY BADGES (200 coins - REALLY HARD!) ───────
  {
    id: "legend_topics_5",
    title: "Grandmaster of Topics",
    description: "Fully master 5 complete topics by passing all their subtopics and Final Topic Mastery Tests.",
    tier: "legendary",
    rewardCoins: 200,
    emoji: "🏆",
    checkUnlocked: (stats) => stats.masteredTopicsCount >= 5,
  },
  {
    id: "legend_streak_14",
    title: "Unstoppable Force",
    description: "Maintain an unbroken 14-day study streak.",
    tier: "legendary",
    rewardCoins: 200,
    emoji: "💫",
    checkUnlocked: (stats) => stats.currentStreak >= 14,
  },
  {
    id: "legend_perfect_10",
    title: "Flawless Virtuoso",
    description: "Achieve a 100% score on 10 different quizzes.",
    tier: "legendary",
    rewardCoins: 200,
    emoji: "💎",
    checkUnlocked: (stats) => stats.perfectQuizzesCount >= 10,
  },
  {
    id: "legend_math_titan",
    title: "Math Titan",
    description: "Master all core Math subjects (Algebra 1, Geometry, Algebra 2, and Calculus).",
    tier: "legendary",
    rewardCoins: 200,
    emoji: "🌌",
    checkUnlocked: (stats) => stats.masteredMathTopicsCount >= 4,
  },
  {
    id: "legend_subtopics_25",
    title: "Apex Academic",
    description: "Master 25 subtopics across the curriculum.",
    tier: "legendary",
    rewardCoins: 200,
    emoji: "🔱",
    checkUnlocked: (stats) => stats.masteredSubtopicsCount >= 25,
  },
];
