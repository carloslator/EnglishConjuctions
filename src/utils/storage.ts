import { INITIAL_BADGES } from '../data/conjunctionData';
import { Badge, ConjunctionCategory, UserProfile } from '../types';

const STORAGE_KEY = 'conjunction_master_profile_v1';

export function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CM-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createInitialProfile(username: string = 'Grammar Scholar'): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  return {
    syncCode: generateSyncCode(),
    username,
    gradeLevel: 'middle_school',
    stats: {
      totalAnswered: 0,
      totalCorrect: 0,
      categoryStats: {
        coordinating: { answered: 0, correct: 0 },
        subordinating: { answered: 0, correct: 0 },
        correlative: { answered: 0, correct: 0 },
        conjunctive_adverb: { answered: 0, correct: 0 },
      },
      streakDays: 1,
      lastActiveDate: today,
      xp: 0,
      level: 1,
    },
    unlockedBadgeIds: [],
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function loadLocalProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialProfile();
      saveLocalProfile(initial);
      return initial;
    }
    const parsed: UserProfile = JSON.parse(raw);
    
    // Validate or backfill missing categories
    if (!parsed.stats.categoryStats.coordinating) {
      parsed.stats.categoryStats = {
        coordinating: { answered: 0, correct: 0 },
        subordinating: { answered: 0, correct: 0 },
        correlative: { answered: 0, correct: 0 },
        conjunctive_adverb: { answered: 0, correct: 0 },
      };
    }
    return checkStreak(parsed);
  } catch (err) {
    console.error('Failed to load profile from local storage, creating default:', err);
    const initial = createInitialProfile();
    saveLocalProfile(initial);
    return initial;
  }
}

export function saveLocalProfile(profile: UserProfile): void {
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to local storage:', err);
  }
}

export function checkStreak(profile: UserProfile): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.stats.lastActiveDate;

  if (lastActive === today) {
    return profile;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActive === yesterdayStr) {
    // Active yesterday, streak continues!
    profile.stats.streakDays += 1;
    profile.stats.lastActiveDate = today;
  } else if (lastActive < yesterdayStr) {
    // Missed more than 1 day, reset streak to 1
    profile.stats.streakDays = 1;
    profile.stats.lastActiveDate = today;
  }

  saveLocalProfile(profile);
  return profile;
}

export function calculateLevel(xp: number): number {
  // 100 XP per level
  return Math.floor(xp / 100) + 1;
}

export function checkBadges(profile: UserProfile): { updatedProfile: UserProfile; newBadges: Badge[] } {
  const newUnlockedBadges: Badge[] = [];
  const stats = profile.stats;
  const currentUnlocked = new Set(profile.unlockedBadgeIds);

  INITIAL_BADGES.forEach((badge) => {
    if (currentUnlocked.has(badge.id)) return;

    let unlocked = false;
    if (badge.id === 'fanboys_master' && stats.categoryStats.coordinating.correct >= 10) unlocked = true;
    if (badge.id === 'subordinate_pro' && stats.categoryStats.subordinating.correct >= 10) unlocked = true;
    if (badge.id === 'correlative_ace' && stats.categoryStats.correlative.correct >= 8) unlocked = true;
    if (badge.id === 'adverb_wizard' && stats.categoryStats.conjunctive_adverb.correct >= 8) unlocked = true;
    if (badge.id === 'streak_3' && stats.streakDays >= 3) unlocked = true;
    if (badge.id === 'streak_7' && stats.streakDays >= 7) unlocked = true;
    if (badge.id === 'perfect_100' && profile.history.some((h) => h.totalQuestions >= 5 && h.score === h.totalQuestions)) unlocked = true;
    if (badge.id === 'ai_apprentice' && profile.history.some((h) => h.mode === 'ai_adaptive')) unlocked = true;

    if (unlocked) {
      currentUnlocked.add(badge.id);
      newUnlockedBadges.push({ ...badge, unlockedAt: new Date().toISOString() });
    }
  });

  profile.unlockedBadgeIds = Array.from(currentUnlocked);
  saveLocalProfile(profile);

  return { updatedProfile: profile, newBadges: newUnlockedBadges };
}

// Cloud Sync Helpers
export async function syncProfileToCloud(profile: UserProfile): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/sync/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true };
    }
    return { success: false, message: data.error || 'Cloud sync failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error syncing profile' };
  }
}

export async function loadProfileFromCloud(syncCode: string): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
  try {
    const res = await fetch(`/api/sync/load/${encodeURIComponent(syncCode)}`);
    const data = await res.json();
    if (res.ok && data.success && data.profile) {
      saveLocalProfile(data.profile);
      return { success: true, profile: data.profile };
    }
    return { success: false, message: data.error || 'Sync code not found' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error connecting to cloud server' };
  }
}
