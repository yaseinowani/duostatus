import type { UserSnapshot } from '../utils/stats.ts';

export interface DuolingoCourse {
  id: string;
  title: string;
  learningLanguage: string;
  fromLanguage: string;
  xp: number;
  crowns: number;
}

export interface DuolingoUser {
  id: number | string;
  username: string;
  name: string;
  bio?: string;
  picture?: string;
  streak: number;
  streakStartDate?: string;
  streakEndDate?: string;
  totalXp: number;
  creationDate: number; // unix timestamp in seconds
  courses: DuolingoCourse[];
  currentCourseId?: string;
  learningLanguage?: string;
}

export interface StoredUserRecord {
  user: DuolingoUser;
  firstTrackedAt: string; // ISO date
  lastUpdatedAt: string; // ISO date
  isReal: boolean;
  isDemo?: boolean;
  snapshots: UserSnapshot[];
}

export interface RankingUserEntry {
  rank: number;
  username: string;
  name: string;
  picture?: string;
  streak: number;
  totalXp: number;
  weeklyXp: number;
  isMeasured: boolean;
  daysSpan: number;
  lastUpdatedAt: string;
  isReal: boolean;
  snapshotCount: number;
  learningLanguages: string[];
}

export interface UserStatsResponse {
  user: DuolingoUser;
  firstTrackedAt: string;
  lastUpdatedAt: string;
  isReal: boolean;
  isDemo: boolean;
  snapshots: UserSnapshot[];
  metrics: {
    weeklyXp: number;
    isMeasured: boolean;
    daysSpan: number;
    monthlyEstimatedXp: number;
    snapshotCount: number;
    streak: number;
    totalXp: number;
    languagesCount: number;
  };
  notice?: string;
}
