/**
 * Language codes to display details (flag emoji, Japanese language name)
 */
export const LANGUAGE_MAP: Record<string, { name: string; flag: string; color: string }> = {
  en: { name: '英語', flag: '🇺🇸', color: '#3b82f6' },
  es: { name: 'スペイン語', flag: '🇪🇸', color: '#ef4444' },
  fr: { name: 'フランス語', flag: '🇫🇷', color: '#8b5cf6' },
  de: { name: 'ドイツ語', flag: '🇩🇪', color: '#f59e0b' },
  ja: { name: '日本語', flag: '🇯🇵', color: '#dc2626' },
  it: { name: 'イタリア語', flag: '🇮🇹', color: '#10b981' },
  ko: { name: '韓国語', flag: '🇰🇷', color: '#06b6d4' },
  zh: { name: '中国語', flag: '🇨🇳', color: '#e11d48' },
  ru: { name: 'ロシア語', flag: '🇷🇺', color: '#6366f1' },
  pt: { name: 'ポルトガル語', flag: '🇵🇹', color: '#14b8a6' },
  nl: { name: 'オランダ語', flag: '🇳🇱', color: '#f97316' },
  sv: { name: 'スウェーデン語', flag: '🇸🇪', color: '#0ea5e9' },
  pl: { name: 'ポーランド語', flag: '🇵🇱', color: '#d946ef' },
  tr: { name: 'トルコ語', flag: '🇹🇷', color: '#ef4444' },
  ar: { name: 'アラビア語', flag: '🇸🇦', color: '#059669' },
  vi: { name: 'ベトナム語', flag: '🇻🇳', color: '#eab308' },
  el: { name: 'ギリシャ語', flag: '🇬🇷', color: '#2563eb' },
  he: { name: 'ヘブライ語', flag: '🇮🇱', color: '#38bdf8' },
  hi: { name: 'ヒンディー語', flag: '🇮🇳', color: '#ea580c' },
  uk: { name: 'ウクライナ語', flag: '🇺🇦', color: '#0284c7' },
  la: { name: 'ラテン語', flag: '🏛️', color: '#a855f7' },
  eo: { name: 'エスペラント語', flag: '🟢', color: '#22c55e' },
};

export interface SnapshotCourse {
  title: string;
  xp: number;
  crowns: number;
  learningLanguage: string;
}

export interface UserSnapshot {
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
  totalXp: number;
  streak: number;
  courses?: SnapshotCourse[];
}

export interface CourseData {
  id: string;
  title: string;
  learningLanguage: string;
  fromLanguage: string;
  xp: number;
  crowns: number;
  percentage?: number;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('ja-JP');
}

/**
 * Format streak days with friendly description
 */
export function formatStreak(days: number | undefined | null): string {
  const count = days || 0;
  if (count <= 0) return '0日';
  return `${count.toLocaleString('ja-JP')}日`;
}

/**
 * Get language info from language code or course title
 */
export function getLanguageInfo(codeOrTitle: string): { name: string; flag: string; color: string } {
  const code = (codeOrTitle || '').toLowerCase();
  if (LANGUAGE_MAP[code]) {
    return LANGUAGE_MAP[code];
  }
  // Search by title match
  for (const [key, val] of Object.entries(LANGUAGE_MAP)) {
    if (code.includes(key) || val.name.toLowerCase().includes(code)) {
      return val;
    }
  }
  return { name: codeOrTitle || '外国語', flag: '🌐', color: '#10b981' };
}

/**
 * Calculate weekly XP gain strictly from snapshot history:
 * Difference between latest totalXp and totalXp from ~7 days ago.
 * If only 1 snapshot exists, returns 0 with indication of single measurement.
 */
export function calculateWeeklyXp(snapshots: UserSnapshot[]): {
  weeklyXp: number;
  isMeasured: boolean;
  daysSpan: number;
} {
  if (!snapshots || snapshots.length === 0) {
    return { weeklyXp: 0, isMeasured: false, daysSpan: 0 };
  }

  const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp);
  const latest = sorted[sorted.length - 1];

  if (sorted.length === 1) {
    return { weeklyXp: 0, isMeasured: false, daysSpan: 0 };
  }

  const sevenDaysAgoMs = latest.timestamp - 7 * 24 * 60 * 60 * 1000;
  // Find snapshot closest to or just before 7 days ago
  let baseline = sorted[0];
  for (const s of sorted) {
    if (s.timestamp <= sevenDaysAgoMs) {
      baseline = s;
    } else {
      break;
    }
  }

  const diff = Math.max(0, latest.totalXp - baseline.totalXp);
  const daysSpan = Math.max(1, Math.round((latest.timestamp - baseline.timestamp) / (24 * 60 * 60 * 1000)));

  return {
    weeklyXp: diff,
    isMeasured: true,
    daysSpan,
  };
}

/**
 * Aggregates course stats, sorting by XP descending and calculating percentages
 */
export function aggregateLanguageStats(courses: CourseData[] | undefined | null) {
  if (!courses || courses.length === 0) {
    return [];
  }

  const totalCourseXp = courses.reduce((sum, c) => sum + (c.xp || 0), 0);

  return [...courses]
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .map((c) => {
      const info = getLanguageInfo(c.learningLanguage || c.title);
      const percentage = totalCourseXp > 0 ? Math.round(((c.xp || 0) / totalCourseXp) * 1000) / 10 : 0;
      return {
        ...c,
        displayName: info.name,
        flag: info.flag,
        color: info.color,
        percentage,
      };
    });
}

/**
 * Generates synthetic daily snapshots for demo mode so users can test interactive charts
 */
export function generateDemoSnapshots(baseTotalXp: number, streak: number, daysCount = 30): UserSnapshot[] {
  const result: UserSnapshot[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Simulate daily XP gains between 30 and 220 XP per day
  let accumulatedXp = Math.max(1000, baseTotalXp - daysCount * 120);

  for (let i = daysCount; i >= 0; i--) {
    const timestamp = now - i * dayMs;
    const date = new Date(timestamp);
    const dateStr = date.toISOString().split('T')[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const dailyGain = isWeekend ? Math.floor(120 + Math.random() * 140) : Math.floor(50 + Math.random() * 80);

    accumulatedXp += dailyGain;
    const simulatedStreak = Math.max(1, streak - i);

    result.push({
      timestamp,
      dateStr,
      totalXp: accumulatedXp,
      streak: simulatedStreak,
    });
  }

  return result;
}

/**
 * Transforms snapshot array into chart-friendly points based on selected period
 */
export function formatChartData(
  snapshots: UserSnapshot[],
  period: '7d' | '30d' | '90d' | 'all' = '30d',
  mode: 'cumulative' | 'dailyGain' = 'cumulative'
) {
  if (!snapshots || snapshots.length === 0) return [];

  const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp);

  const now = Date.now();
  let cutoff = 0;
  if (period === '7d') cutoff = now - 7 * 86400000;
  else if (period === '30d') cutoff = now - 30 * 86400000;
  else if (period === '90d') cutoff = now - 90 * 86400000;

  const filtered = cutoff > 0 ? sorted.filter((s) => s.timestamp >= cutoff) : sorted;

  if (filtered.length === 0) return [];

  return filtered.map((item, idx) => {
    const prev = idx > 0 ? filtered[idx - 1] : item;
    const dailyGain = Math.max(0, item.totalXp - prev.totalXp);

    const parts = item.dateStr.split('-');
    const shortDate = parts.length === 3 ? `${parts[1]}/${parts[2]}` : item.dateStr;

    return {
      date: item.dateStr,
      shortDate,
      totalXp: item.totalXp,
      dailyGain: idx === 0 ? 0 : dailyGain,
      streak: item.streak,
    };
  });
}

export interface SearchHistoryItem {
  username: string;
  name: string;
  picture?: string;
  totalXp: number;
  streak: number;
  timestamp: number;
  isFavorite?: boolean;
}

export interface StreakMilestone {
  target: number;
  label: string;
  remainingDays: number;
  isReached: boolean;
}

export interface XpTierMilestone {
  tier: number;
  label: string;
  remainingXp: number;
  isReached: boolean;
}

export function calculateMilestones(streak: number, totalXp: number) {
  const STREAK_TARGETS = [7, 30, 50, 100, 200, 365, 500, 1000, 2000, 3000];
  const XP_TARGETS = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

  const currentStreak = Math.max(0, streak || 0);
  const currentXp = Math.max(0, totalXp || 0);

  // Next streak milestone
  const nextStreakTarget = STREAK_TARGETS.find((t) => t > currentStreak) || (currentStreak + 100);
  const streakMilestones: StreakMilestone[] = STREAK_TARGETS.map((target) => ({
    target,
    label: `${target}日連続学習`,
    remainingDays: Math.max(0, target - currentStreak),
    isReached: currentStreak >= target,
  }));

  // Next XP tier milestone
  const nextXpTarget = XP_TARGETS.find((t) => t > currentXp) || (currentXp + 50000);
  const xpMilestones: XpTierMilestone[] = XP_TARGETS.map((tier) => ({
    tier,
    label: `${formatNumber(tier)} XP 到達`,
    remainingXp: Math.max(0, tier - currentXp),
    isReached: currentXp >= tier,
  }));

  return {
    currentStreak,
    nextStreakTarget,
    streakDaysRemaining: Math.max(0, nextStreakTarget - currentStreak),
    streakMilestones,
    currentXp,
    nextXpTarget,
    xpRemaining: Math.max(0, nextXpTarget - currentXp),
    xpMilestones,
  };
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  isUnlocked: boolean;
  progressPercent: number;
}

export function calculateAchievementBadges(totalXp: number, streak: number, coursesCount: number): AchievementBadge[] {
  const xp = totalXp || 0;
  const s = streak || 0;
  const c = coursesCount || 1;

  return [
    {
      id: 'first-step',
      title: '第一歩を踏み出した学習者',
      description: '総XPが100 XPを突破',
      iconName: 'Footprints',
      color: '#10b981',
      isUnlocked: xp >= 100,
      progressPercent: Math.min(100, Math.round((xp / 100) * 100)),
    },
    {
      id: 'week-streak',
      title: '1週間の継続ルーティン',
      description: '連続学習7日達成',
      iconName: 'Flame',
      color: '#f97316',
      isUnlocked: s >= 7,
      progressPercent: Math.min(100, Math.round((s / 7) * 100)),
    },
    {
      id: 'polyglot',
      title: 'マルチリンガルへの道',
      description: '2言語以上のコースを並行学習',
      iconName: 'Globe',
      color: '#3b82f6',
      isUnlocked: c >= 2,
      progressPercent: Math.min(100, Math.round((c / 2) * 100)),
    },
    {
      id: 'month-streak',
      title: '習慣化マスター',
      description: '連続学習30日（1ヶ月）達成',
      iconName: 'CalendarCheck',
      color: '#eab308',
      isUnlocked: s >= 30,
      progressPercent: Math.min(100, Math.round((s / 30) * 100)),
    },
    {
      id: 'xp-10k',
      title: 'XP 10,000 クラブ',
      description: '累計10,000 XPを獲得',
      iconName: 'Zap',
      color: '#8b5cf6',
      isUnlocked: xp >= 10000,
      progressPercent: Math.min(100, Math.round((xp / 10000) * 100)),
    },
    {
      id: 'century-streak',
      title: '100日の金字塔',
      description: '連続学習100日達成',
      iconName: 'Award',
      color: '#ec4899',
      isUnlocked: s >= 100,
      progressPercent: Math.min(100, Math.round((s / 100) * 100)),
    },
    {
      id: 'xp-100k',
      title: '言語の達人 (100k XP)',
      description: '累計100,000 XPを獲得',
      iconName: 'Crown',
      color: '#f59e0b',
      isUnlocked: xp >= 100000,
      progressPercent: Math.min(100, Math.round((xp / 100000) * 100)),
    },
    {
      id: 'year-streak',
      title: '365日 年中無休の情熱',
      description: '1年間（365日）の連続学習を達成',
      iconName: 'Sparkles',
      color: '#059669',
      isUnlocked: s >= 365,
      progressPercent: Math.min(100, Math.round((s / 365) * 100)),
    },
  ];
}

