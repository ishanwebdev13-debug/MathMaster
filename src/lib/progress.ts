import { supabase } from "./supabase";

export type ProgressStatus = "not_started" | "in_progress" | "mastered";

export interface QuizAttemptRecord {
  subtopicSlug: string;
  difficulty: string;
  score: number;
  total: number;
  passed: boolean;
  durationSeconds: number;
  timestamp: string;
}

export interface LocalProgress {
  subtopicStatuses: Record<string, ProgressStatus>;
  masteredTopics: Record<string, boolean>;
  coins: number;
  claimedBadges: Record<string, boolean>;
  quizHistory: QuizAttemptRecord[];
  initialBonusClaimed?: boolean;
  shark67Unlocked?: boolean;
  infiniteCoinsEnabled?: boolean;
  avatarId?: string;
}

const STORAGE_KEY = "unlimited_learning_progress";

export function getLocalProgress(userId?: string): LocalProgress {
  const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Give initial 1000 free coins on first startup if not yet claimed
      if (!parsed.initialBonusClaimed) {
        parsed.coins = Math.max(typeof parsed.coins === "number" ? parsed.coins : 0, 1000);
        parsed.initialBonusClaimed = true;
        try {
          localStorage.setItem(key, JSON.stringify(parsed));
        } catch (e) {
          // ignore
        }
      }
      return {
        subtopicStatuses: parsed.subtopicStatuses || {},
        masteredTopics: parsed.masteredTopics || {},
        coins: typeof parsed.coins === "number" ? parsed.coins : 1000,
        claimedBadges: parsed.claimedBadges || {},
        quizHistory: parsed.quizHistory || [],
        initialBonusClaimed: true,
        shark67Unlocked: !!parsed.shark67Unlocked,
        infiniteCoinsEnabled: !!parsed.infiniteCoinsEnabled,
        avatarId: parsed.avatarId || "dragon_master",
      };
    }
  } catch (e) {
    console.warn("Failed to load local progress:", e);
  }
  const defaultProg: LocalProgress = {
    subtopicStatuses: {},
    masteredTopics: {},
    coins: 1000, // First time user receives 1000 free coins!
    claimedBadges: {},
    quizHistory: [],
    initialBonusClaimed: true,
    shark67Unlocked: false,
    infiniteCoinsEnabled: false,
    avatarId: "dragon_master",
  };
  try {
    localStorage.setItem(key, JSON.stringify(defaultProg));
  } catch (e) {
    // ignore
  }
  return defaultProg;
}

export function setAvatarId(avatarId: string, userId?: string) {
  const progress = getLocalProgress(userId);
  progress.avatarId = avatarId;
  saveLocalProgress(progress, userId);
}

export function saveLocalProgress(progress: LocalProgress, userId?: string) {
  const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
  try {
    localStorage.setItem(key, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent("mathmaster:progress-updated", { detail: progress }));
    window.dispatchEvent(new CustomEvent("mathmaster:coins-updated", { detail: progress.coins }));
  } catch (e) {
    console.warn("Failed to save local progress:", e);
  }
}

export function setCoins(amount: number, userId?: string): number {
  const progress = getLocalProgress(userId);
  progress.coins = Math.max(0, amount);
  saveLocalProgress(progress, userId);

  if (userId) {
    supabase
      .from("user_streaks")
      .update({ coins: progress.coins })
      .eq("user_id", userId)
      .then();
  }

  return progress.coins;
}

export function setShark67Unlocked(unlocked: boolean, userId?: string) {
  const progress = getLocalProgress(userId);
  progress.shark67Unlocked = unlocked;
  saveLocalProgress(progress, userId);
}

export function setInfiniteCoinsEnabled(enabled: boolean, userId?: string) {
  const progress = getLocalProgress(userId);
  progress.infiniteCoinsEnabled = enabled;
  if (enabled && progress.coins < 99999) {
    progress.coins = 99999;
  }
  saveLocalProgress(progress, userId);
}

export function addCoins(amount: number, userId?: string): number {
  if (amount <= 0) return getCoins(userId);
  const progress = getLocalProgress(userId);
  progress.coins = (progress.coins || 0) + amount;
  saveLocalProgress(progress, userId);

  if (userId) {
    supabase.rpc("add_coins", { user_id: userId, amount }).then(({ error }) => {
      if (error) {
        supabase
          .from("user_streaks")
          .update({ coins: progress.coins })
          .eq("user_id", userId)
          .then();
      }
    });
  }

  return progress.coins;
}

export function getCoins(userId?: string): number {
  const progress = getLocalProgress(userId);
  if (progress.infiniteCoinsEnabled) return 99999;
  return progress.coins || 0;
}

export function deductCoins(amount: number, userId?: string): boolean {
  if (amount <= 0) return true;
  const progress = getLocalProgress(userId);
  if (progress.infiniteCoinsEnabled) {
    return true; // Infinite coins cheat mode active!
  }
  if ((progress.coins || 0) < amount) {
    return false;
  }

  progress.coins -= amount;
  saveLocalProgress(progress, userId);

  if (userId) {
    supabase
      .from("user_streaks")
      .update({ coins: progress.coins })
      .eq("user_id", userId)
      .then();
  }

  return true;
}

export function claimBadgeCoins(badgeId: string, coinReward: number, userId?: string): { success: boolean; newTotal: number } {
  const progress = getLocalProgress(userId);
  if (progress.claimedBadges[badgeId]) {
    return { success: false, newTotal: progress.coins };
  }

  progress.claimedBadges[badgeId] = true;
  progress.coins = (progress.coins || 0) + coinReward;
  saveLocalProgress(progress, userId);

  if (userId) {
    supabase
      .from("user_badges")
      .upsert({
        user_id: userId,
        badge_slug: badgeId,
        earned_at: new Date().toISOString(),
        claimed: true,
      })
      .then();
  }

  return { success: true, newTotal: progress.coins };
}

export function getSubtopicStatus(subtopicIdOrSlug: string, userId?: string): ProgressStatus {
  const progress = getLocalProgress(userId);
  return progress.subtopicStatuses[subtopicIdOrSlug] || "not_started";
}

export function setSubtopicStatus(subtopicIdOrSlug: string, status: ProgressStatus, userId?: string) {
  const progress = getLocalProgress(userId);
  const prevStatus = progress.subtopicStatuses[subtopicIdOrSlug];
  
  progress.subtopicStatuses[subtopicIdOrSlug] = status;
  
  // Award 50 coins if newly mastered!
  if (status === "mastered" && prevStatus !== "mastered") {
    progress.coins = (progress.coins || 0) + 50;
  }
  
  saveLocalProgress(progress, userId);

  if (userId) {
    const dbSubtopicId = subtopicIdOrSlug.replace("local-", "");
    supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        subtopic_id: dbSubtopicId,
        status,
        updated_at: new Date().toISOString(),
      })
      .then();
  }
}

export function isTopicFullyMastered(topicIdOrSlug: string, userId?: string): boolean {
  const progress = getLocalProgress(userId);
  return !!progress.masteredTopics[topicIdOrSlug];
}

export function setTopicFullyMastered(topicIdOrSlug: string, isMastered = true, userId?: string) {
  const progress = getLocalProgress(userId);
  const wasMastered = progress.masteredTopics[topicIdOrSlug];
  
  progress.masteredTopics[topicIdOrSlug] = isMastered;
  
  // Award 300 coins for full topic mastery if newly mastered!
  if (isMastered && !wasMastered) {
    progress.coins = (progress.coins || 0) + 300;
  }
  
  saveLocalProgress(progress, userId);

  if (userId) {
    supabase
      .from("users")
      .update({
        metadata: { [`mastered_topic_${topicIdOrSlug}`]: isMastered }
      })
      .eq("id", userId)
      .then();
  }
}

export function recordQuizAttempt(attempt: QuizAttemptRecord, userId?: string) {
  const progress = getLocalProgress(userId);
  progress.quizHistory.unshift(attempt);
  if (progress.quizHistory.length > 100) progress.quizHistory.pop();
  
  // Award quiz completion coins:
  // Core (5 coins), Intermediate (10 coins), Advanced / Mastery (15 coins)
  if (attempt.passed) {
    let earnedCoins = 5; // Core/Easy
    if (attempt.difficulty === "intermediate") earnedCoins = 10;
    else if (attempt.difficulty === "advanced" || attempt.difficulty === "mastery") earnedCoins = 15;
    
    progress.coins = (progress.coins || 0) + earnedCoins;
  }

  saveLocalProgress(progress, userId);
}
