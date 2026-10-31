import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { fetchDuolingoProfile } from './server/duolingoService.ts';
import {
  initStorage,
  getStoredUser,
  recordUserSnapshot,
  formatUserStatsResponse,
  getLeaderboard,
  getSystemStats,
  addManualStudyLog,
  optOutUser,
} from './server/storage.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize snapshot storage and seeded profiles
  initStorage();

  app.use(express.json());

  // Legal compliance & fan project identification headers
  app.use((req, res, next) => {
    res.setHeader('X-Unofficial-Fan-Project', 'DuoStats (Not affiliated with Duolingo, Inc.)');
    res.setHeader('X-Duolingo-ToS-Compliant', 'Strictly-On-Demand-No-Crawlers');
    next();
  });

  // Client IP rate limiting to prevent automated scraping of Duolingo endpoints
  const ipRequests = new Map<string, number[]>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
  const MAX_REQUESTS_PER_WINDOW = 15; // Max 15 user lookups per minute per IP

  const isRateLimited = (ip: string): boolean => {
    const now = Date.now();
    const timestamps = (ipRequests.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return true;
    }
    timestamps.push(now);
    ipRequests.set(ip, timestamps);
    return false;
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'DuoStats Unofficial API',
      tosCompliance: 'On-Demand Public Verification Only (No Crawling Bots)',
    });
  });

  app.get('/api/status', (req, res) => {
    const stats = getSystemStats();
    res.json({ status: 'ok', ...stats });
  });

  // Get user profile & stats with strict ToS safeguards
  app.get('/api/user/:username', async (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: 'リクエスト頻度が高すぎます。Duolingo利用規約を遵守するため、少し時間を置いてから再試行してください（手動記録モードはいつでも通信不要でご利用いただけます）。',
        code: 'CLIENT_RATE_LIMITED',
      });
    }

    const rawUsername = req.params.username;
    const forceRefresh = req.query.force === 'true';

    if (!rawUsername || !rawUsername.trim()) {
      return res.status(400).json({ error: 'ユーザー名が指定されていません。' });
    }

    const username = rawUsername.trim();
    const stored = getStoredUser(username);

    // 15-minute aggressive cache to protect Duolingo from repeated calls
    const CACHE_TTL_MS = 15 * 60 * 1000;
    const isRecentlyCached =
      stored &&
      !forceRefresh &&
      Date.now() - new Date(stored.lastUpdatedAt).getTime() < CACHE_TTL_MS;

    // Cooldown protection for force-refresh: max once every 45s per user
    if (forceRefresh && stored && Date.now() - new Date(stored.lastUpdatedAt).getTime() < 45 * 1000) {
      return res.json(formatUserStatsResponse(stored));
    }

    if (stored?.isDemo || isRecentlyCached) {
      return res.json(formatUserStatsResponse(stored));
    }

    // Try fetching live public profile from Duolingo
    try {
      const fetchResult = await fetchDuolingoProfile(username);

      if (fetchResult.success && fetchResult.user) {
        // Record new snapshot and update user in persistent store
        const record = recordUserSnapshot(fetchResult.user, true);
        return res.json(formatUserStatsResponse(record));
      }

      // Fetch was unsuccessful
      if (stored) {
        // Fallback to cached data if available
        const response = formatUserStatsResponse(stored);
        response.notice =
          fetchResult.error?.message || '最新データの取得に失敗したため、前回のキャッシュを表示しています。';
        return res.json(response);
      }

      const status = fetchResult.error?.code === 'NOT_FOUND' ? 404 : 502;
      return res.status(status).json({
        error: fetchResult.error?.message || 'ユーザーデータの取得に失敗しました。',
        code: fetchResult.error?.code || 'FETCH_FAILED',
      });
    } catch (err: any) {
      if (stored) {
        const response = formatUserStatsResponse(stored);
        response.notice = '通信エラーが発生したため、前回のキャッシュを表示しています。';
        return res.json(response);
      }
      return res.status(500).json({
        error: 'サーバー内部エラーが発生しました。',
        details: err.message,
      });
    }
  });

  // Force capture snapshot
  app.post('/api/user/:username/snapshot', async (req, res) => {
    const username = req.params.username;
    const stored = getStoredUser(username);

    if (stored?.isDemo) {
      return res.json(formatUserStatsResponse(stored));
    }

    const fetchResult = await fetchDuolingoProfile(username);
    if (!fetchResult.success || !fetchResult.user) {
      return res.status(400).json({
        error: fetchResult.error?.message || '最新スナップショットの取得に失敗しました。',
      });
    }

    const updated = recordUserSnapshot(fetchResult.user, true);
    return res.json(formatUserStatsResponse(updated));
  });

  // Manual study log (Safe mode, 100% compliant)
  app.post('/api/user/:username/log', (req, res) => {
    const rawUsername = req.params.username;
    if (!rawUsername || !rawUsername.trim()) {
      return res.status(400).json({ error: 'ユーザー名が指定されていません。' });
    }

    const { xp, streak, language, displayName } = req.body || {};
    const xpNum = Number(xp || 0);

    if (isNaN(xpNum) || xpNum <= 0) {
      return res.status(400).json({ error: '有効な獲得XP（1以上）を入力してください。' });
    }

    const record = addManualStudyLog(
      rawUsername.trim(),
      xpNum,
      streak ? Number(streak) : undefined,
      language ? String(language).toLowerCase() : 'en',
      displayName ? String(displayName) : undefined
    );

    res.json(formatUserStatsResponse(record));
  });

  // Opt-out / Delete user upon request
  app.post('/api/user/:username/optout', (req, res) => {
    const rawUsername = req.params.username;
    if (!rawUsername || !rawUsername.trim()) {
      return res.status(400).json({ error: 'ユーザー名が指定されていません。' });
    }

    const success = optOutUser(rawUsername.trim());
    res.json({
      success,
      message: success
        ? `ユーザー「${rawUsername}」の記録を正常に完全削除・除外しました。`
        : `ユーザー「${rawUsername}」の記録は存在しませんでした。`,
    });
  });

  // Leaderboard ranking
  app.get('/api/ranking', (req, res) => {
    const filter = (req.query.filter as 'all' | 'real' | 'demo') || 'all';
    const leaderboard = getLeaderboard(filter);
    res.json({
      leaderboard,
      count: leaderboard.length,
      calculatedAt: new Date().toISOString(),
      formula: '週間XP = 最新の総XP - 過去7日以内の最古スナップショット総XP (未計測または初回到達時は0 XP)',
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DuoStats server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
