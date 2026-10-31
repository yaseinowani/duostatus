import fs from 'fs';
import path from 'path';
import { StoredUserRecord, DuolingoUser, RankingUserEntry, UserStatsResponse } from '../src/types/index.ts';
import { calculateWeeklyXp, generateDemoSnapshots, UserSnapshot } from '../src/utils/stats.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORAGE_FILE = path.join(DATA_DIR, 'duostats_store.json');

// In-memory cache of user records
const userStore = new Map<string, StoredUserRecord>();

/**
 * Helper to generate seeded demo profiles
 */
function createDemoSeed(): StoredUserRecord[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // 1. tanaka_learning
  const tanakaSnaps = generateDemoSnapshots(96750, 415, 14);
  const tanaka: StoredUserRecord = {
    user: {
      id: 1001,
      username: 'tanaka_learning',
      name: '田中 健太',
      bio: '毎日コツコツ英語とスペイン語を学習中！めざせ連続500日。',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      streak: 415,
      totalXp: tanakaSnaps[tanakaSnaps.length - 1].totalXp,
      creationDate: Math.floor((now - 450 * dayMs) / 1000),
      courses: [
        { id: 'en', title: 'English', learningLanguage: 'en', fromLanguage: 'ja', xp: 82450, crowns: 142 },
        { id: 'es', title: 'Spanish', learningLanguage: 'es', fromLanguage: 'en', xp: 14300, crowns: 38 },
      ],
      learningLanguage: 'en',
    },
    firstTrackedAt: new Date(now - 14 * dayMs).toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    isReal: false,
    isDemo: true,
    snapshots: tanakaSnaps,
  };

  // 2. sakura_polyglot
  const sakuraSnaps = generateDemoSnapshots(136500, 730, 21);
  const sakura: StoredUserRecord = {
    user: {
      id: 1002,
      username: 'sakura_polyglot',
      name: 'Sakura M.',
      bio: 'ヨーロッパ諸言語と韓国語をマルチ学習。語学仲間募集中！',
      picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      streak: 730,
      totalXp: sakuraSnaps[sakuraSnaps.length - 1].totalXp,
      creationDate: Math.floor((now - 800 * dayMs) / 1000),
      courses: [
        { id: 'fr', title: 'French', learningLanguage: 'fr', fromLanguage: 'en', xp: 68000, crowns: 120 },
        { id: 'de', title: 'German', learningLanguage: 'de', fromLanguage: 'en', xp: 32000, crowns: 64 },
        { id: 'ko', title: 'Korean', learningLanguage: 'ko', fromLanguage: 'ja', xp: 24500, crowns: 45 },
        { id: 'zh', title: 'Chinese', learningLanguage: 'zh', fromLanguage: 'en', xp: 12000, crowns: 22 },
      ],
      learningLanguage: 'fr',
    },
    firstTrackedAt: new Date(now - 21 * dayMs).toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    isReal: false,
    isDemo: true,
    snapshots: sakuraSnaps,
  };

  // 3. kenji_streak
  const kenjiSnaps = generateDemoSnapshots(245800, 1280, 28);
  const kenji: StoredUserRecord = {
    user: {
      id: 1003,
      username: 'kenji_streak',
      name: 'KENJI',
      bio: 'ストリーク途切れたら人生やり直し。1200日突破！',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      streak: 1280,
      totalXp: kenjiSnaps[kenjiSnaps.length - 1].totalXp,
      creationDate: Math.floor((now - 1350 * dayMs) / 1000),
      courses: [
        { id: 'en', title: 'English', learningLanguage: 'en', fromLanguage: 'ja', xp: 215800, crowns: 260 },
        { id: 'it', title: 'Italian', learningLanguage: 'it', fromLanguage: 'en', xp: 30000, crowns: 52 },
      ],
      learningLanguage: 'en',
    },
    firstTrackedAt: new Date(now - 28 * dayMs).toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    isReal: false,
    isDemo: true,
    snapshots: kenjiSnaps,
  };

  // 4. yuki_beginner
  const yukiSnaps = generateDemoSnapshots(8900, 14, 7);
  const yuki: StoredUserRecord = {
    user: {
      id: 1004,
      username: 'yuki_beginner',
      name: 'ユウキ',
      bio: 'Duolingo始めたばかりです！通勤時間に毎日2レッスン。',
      picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      streak: 14,
      totalXp: yukiSnaps[yukiSnaps.length - 1].totalXp,
      creationDate: Math.floor((now - 20 * dayMs) / 1000),
      courses: [
        { id: 'en', title: 'English', learningLanguage: 'en', fromLanguage: 'ja', xp: 8900, crowns: 16 },
      ],
      learningLanguage: 'en',
    },
    firstTrackedAt: new Date(now - 7 * dayMs).toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    isReal: false,
    isDemo: true,
    snapshots: yukiSnaps,
  };

  return [tanaka, sakura, kenji, yuki];
}

/**
 * Initializes storage by loading from file or seeding initial records
 */
export function initStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORAGE_FILE)) {
      const content = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed: StoredUserRecord[] = JSON.parse(content);
      for (const rec of parsed) {
        userStore.set(rec.user.username.toLowerCase(), rec);
      }
    }
  } catch (err) {
    console.warn('Failed to load storage from disk, using in-memory store:', err);
  }

  // Ensure demo records always exist
  const seeds = createDemoSeed();
  for (const seed of seeds) {
    const key = seed.user.username.toLowerCase();
    if (!userStore.has(key)) {
      userStore.set(key, seed);
    }
  }
}

/**
 * Persists store to JSON file asynchronously
 */
function persistStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const array = Array.from(userStore.values());
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(array, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write storage file:', err);
  }
}

/**
 * Get record by username
 */
export function getStoredUser(username: string): StoredUserRecord | undefined {
  return userStore.get(username.trim().toLowerCase());
}

/**
 * Records a real or updated user snapshot
 */
export function recordUserSnapshot(user: DuolingoUser, isReal = true): StoredUserRecord {
  const key = user.username.trim().toLowerCase();
  const now = new Date();
  const nowIso = now.toISOString();
  const dateStr = nowIso.split('T')[0];
  const timestamp = now.getTime();

  let existing = userStore.get(key);

  const snapshotCourseList = (user.courses || []).map((c) => ({
    title: c.title,
    xp: c.xp,
    crowns: c.crowns,
    learningLanguage: c.learningLanguage,
  }));

  const newSnapshot: UserSnapshot = {
    timestamp,
    dateStr,
    totalXp: user.totalXp,
    streak: user.streak,
    courses: snapshotCourseList,
  };

  if (!existing) {
    existing = {
      user,
      firstTrackedAt: nowIso,
      lastUpdatedAt: nowIso,
      isReal,
      isDemo: !isReal,
      snapshots: [newSnapshot],
    };
  } else {
    // Update current user details
    existing.user = user;
    existing.lastUpdatedAt = nowIso;
    existing.isReal = isReal;
    if (isReal) existing.isDemo = false;

    // Check last snapshot: if it was taken today and has the exact same totalXp, update timestamp only.
    // If totalXp changed or different day, append!
    const snaps = existing.snapshots;
    const lastSnap = snaps[snaps.length - 1];

    if (lastSnap && lastSnap.dateStr === dateStr && lastSnap.totalXp === user.totalXp) {
      lastSnap.timestamp = timestamp;
      lastSnap.streak = user.streak;
      lastSnap.courses = snapshotCourseList;
    } else {
      snaps.push(newSnapshot);
    }
  }

  userStore.set(key, existing);
  persistStorage();
  return existing;
}

/**
 * Formats user record into API response
 */
export function formatUserStatsResponse(record: StoredUserRecord): UserStatsResponse {
  const { user, firstTrackedAt, lastUpdatedAt, isReal, isDemo, snapshots } = record;
  const weeklyResult = calculateWeeklyXp(snapshots);

  // Estimate monthly XP based on available data or weekly rate
  const monthlyEstimatedXp = weeklyResult.isMeasured
    ? Math.round((weeklyResult.weeklyXp / (weeklyResult.daysSpan || 7)) * 30)
    : 0;

  return {
    user,
    firstTrackedAt,
    lastUpdatedAt,
    isReal,
    isDemo: Boolean(isDemo),
    snapshots,
    metrics: {
      weeklyXp: weeklyResult.weeklyXp,
      isMeasured: weeklyResult.isMeasured,
      daysSpan: weeklyResult.daysSpan,
      monthlyEstimatedXp,
      snapshotCount: snapshots.length,
      streak: user.streak,
      totalXp: user.totalXp,
      languagesCount: user.courses?.length || 0,
    },
    notice:
      snapshots.length <= 1
        ? '初回計測時のスナップショットを記録しました。次回アクセス時以降の差分から獲得XP推移を算出します。'
        : undefined,
  };
}

/**
 * Retrieves weekly rankings for registered / tracked users
 */
export function getLeaderboard(filter: 'all' | 'real' | 'demo' = 'all'): RankingUserEntry[] {
  const records = Array.from(userStore.values());

  const filtered = records.filter((rec) => {
    if (filter === 'real') return rec.isReal;
    if (filter === 'demo') return rec.isDemo;
    return true;
  });

  const entries = filtered.map((rec) => {
    const weekly = calculateWeeklyXp(rec.snapshots);
    const languages = (rec.user.courses || []).map((c) => c.learningLanguage || c.title);

    return {
      username: rec.user.username,
      name: rec.user.name,
      picture: rec.user.picture,
      streak: rec.user.streak,
      totalXp: rec.user.totalXp,
      weeklyXp: weekly.weeklyXp,
      isMeasured: weekly.isMeasured,
      daysSpan: weekly.daysSpan,
      lastUpdatedAt: rec.lastUpdatedAt,
      isReal: rec.isReal,
      snapshotCount: rec.snapshots.length,
      learningLanguages: languages.slice(0, 4),
    };
  });

  // Sort primarily by weekly XP descending; if zero/unmeasured, by totalXp
  entries.sort((a, b) => {
    if (b.weeklyXp !== a.weeklyXp) {
      return b.weeklyXp - a.weeklyXp;
    }
    return b.totalXp - a.totalXp;
  });

  return entries.map((entry, index) => ({
    rank: index + 1,
    ...entry,
  }));
}

/**
 * Get quick system statistics
 */
export function getSystemStats() {
  const records = Array.from(userStore.values());
  const realCount = records.filter((r) => r.isReal).length;
  const demoCount = records.filter((r) => r.isDemo).length;

  return {
    totalTracked: records.length,
    realCount,
    demoCount,
  };
}

/**
 * Add a user-submitted manual study log (Safe mode, 100% ToS compliant)
 */
export function addManualStudyLog(
  username: string,
  xpGained: number,
  streak?: number,
  languageCode = 'en',
  displayName?: string
): StoredUserRecord {
  const key = username.trim().toLowerCase();
  const now = new Date();
  const nowIso = now.toISOString();
  const dateStr = nowIso.split('T')[0];
  const timestamp = now.getTime();

  let existing = userStore.get(key);

  if (!existing) {
    const initialUser: DuolingoUser = {
      id: Math.floor(Math.random() * 900000) + 100000,
      username: username.trim(),
      name: displayName || username.trim(),
      bio: 'DuoStats安全学習トラッカーで日々の記録を管理中',
      streak: Math.max(1, streak || 1),
      totalXp: Math.max(0, xpGained),
      creationDate: Math.floor(timestamp / 1000),
      courses: [
        {
          id: languageCode,
          title: languageCode.toUpperCase(),
          learningLanguage: languageCode,
          fromLanguage: 'ja',
          xp: Math.max(0, xpGained),
          crowns: 1,
        },
      ],
      learningLanguage: languageCode,
    };

    const initialSnapshot: UserSnapshot = {
      timestamp,
      dateStr,
      totalXp: initialUser.totalXp,
      streak: initialUser.streak,
      courses: [
        {
          title: languageCode.toUpperCase(),
          xp: initialUser.totalXp,
          crowns: 1,
          learningLanguage: languageCode,
        },
      ],
    };

    existing = {
      user: initialUser,
      firstTrackedAt: nowIso,
      lastUpdatedAt: nowIso,
      isReal: true,
      isDemo: false,
      snapshots: [initialSnapshot],
    };
  } else {
    // Increment existing total XP
    const newTotal = existing.user.totalXp + Math.max(0, xpGained);
    existing.user.totalXp = newTotal;
    if (streak !== undefined && streak > 0) {
      existing.user.streak = streak;
    }
    existing.lastUpdatedAt = nowIso;

    // Update course xp
    const course = existing.user.courses?.find(
      (c) => c.learningLanguage.toLowerCase() === languageCode.toLowerCase()
    );
    if (course) {
      course.xp += Math.max(0, xpGained);
    } else if (existing.user.courses) {
      existing.user.courses.push({
        id: languageCode,
        title: languageCode.toUpperCase(),
        learningLanguage: languageCode,
        fromLanguage: 'ja',
        xp: Math.max(0, xpGained),
        crowns: 1,
      });
    }

    const snapshotCourseList = (existing.user.courses || []).map((c) => ({
      title: c.title,
      xp: c.xp,
      crowns: c.crowns,
      learningLanguage: c.learningLanguage,
    }));

    // If latest snapshot is from today, increment it; otherwise append new snapshot
    const snaps = existing.snapshots;
    const lastSnap = snaps[snaps.length - 1];

    if (lastSnap && lastSnap.dateStr === dateStr) {
      lastSnap.timestamp = timestamp;
      lastSnap.totalXp = newTotal;
      lastSnap.streak = existing.user.streak;
      lastSnap.courses = snapshotCourseList;
    } else {
      snaps.push({
        timestamp,
        dateStr,
        totalXp: newTotal,
        streak: existing.user.streak,
        courses: snapshotCourseList,
      });
    }
  }

  userStore.set(key, existing);
  persistStorage();
  return existing;
}

/**
 * Opt-out / Delete user account and all snapshots upon request (Privacy & Compliance)
 */
export function optOutUser(username: string): boolean {
  const key = username.trim().toLowerCase();
  const deleted = userStore.delete(key);
  if (deleted) {
    persistStorage();
  }
  return deleted;
}
