import { DuolingoUser, DuolingoCourse } from '../src/types/index.ts';

const DUOLINGO_API_BASE = 'https://www.duolingo.com/2017-06-30/users';
const FETCH_TIMEOUT_MS = 8500;

export interface DuolingoFetchResult {
  success: boolean;
  user?: DuolingoUser;
  error?: {
    code: 'NOT_FOUND' | 'RATE_LIMITED' | 'TIMEOUT' | 'NETWORK_ERROR' | 'UNKNOWN';
    message: string;
  };
}

/**
 * Normalizes image url from Duolingo, which often starts with //
 */
function normalizePictureUrl(url?: string): string {
  if (!url) return '';
  let normalized = url;
  if (normalized.startsWith('//')) {
    normalized = `https:${normalized}`;
  }
  // If it is a Duolingo cloudfront render path without extension or sizing suffix, append /xlarge
  if (normalized.includes('cloudfront.net/static/render/') && !normalized.endsWith('/medium') && !normalized.endsWith('/xlarge') && !normalized.endsWith('.png') && !normalized.endsWith('.jpg')) {
    normalized = `${normalized}/xlarge`;
  }
  return normalized;
}

/**
 * Fetches a public Duolingo user profile safely.
 * This does NOT require any password, user cookies, or API keys.
 * Only accesses publicly exposed profile and course totals.
 */
export async function fetchDuolingoProfile(username: string): Promise<DuolingoFetchResult> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: 'ユーザー名が入力されていません。' },
    };
  }

  const url = `${DUOLINGO_API_BASE}?username=${encodeURIComponent(cleanUsername)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Duolingo側で一時的にアクセス制限が行われています。しばらく待ってから再試行してください。',
        },
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `Duolingoへのリクエストに失敗しました (HTTP ${response.status})。`,
        },
      };
    }

    const data = (await response.json()) as { users?: any[] };
    if (!data.users || data.users.length === 0) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `ユーザー「${cleanUsername}」は見つかりませんでした。スペルや非公開設定をご確認ください。`,
        },
      };
    }

    const raw = data.users[0];

    // Safely parse courses
    const courses: DuolingoCourse[] = (raw.courses || []).map((c: any) => ({
      id: String(c.id || ''),
      title: String(c.title || ''),
      learningLanguage: String(c.learningLanguage || ''),
      fromLanguage: String(c.fromLanguage || ''),
      xp: Number(c.xp || 0),
      crowns: Number(c.crowns || 0),
    }));

    const user: DuolingoUser = {
      id: raw.id || 0,
      username: raw.username || cleanUsername,
      name: raw.name || raw.username || cleanUsername,
      bio: raw.bio || '',
      picture: normalizePictureUrl(raw.picture),
      streak: Number(raw.streak || 0),
      streakStartDate: raw.streakData?.currentStreak?.startDate,
      streakEndDate: raw.streakData?.currentStreak?.endDate,
      totalXp: Number(raw.totalXp || 0),
      creationDate: Number(raw.creationDate || 0),
      courses,
      currentCourseId: raw.currentCourseId || undefined,
      learningLanguage: raw.learningLanguage || undefined,
    };

    return {
      success: true,
      user,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'Duolingoサーバーからの応答がタイムアウトしました。時間をおいて再試行してください。',
        },
      };
    }
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err.message || '通信エラーが発生しました。',
      },
    };
  }
}
