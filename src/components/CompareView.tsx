import { useState, useEffect } from 'react';
import {
  Swords,
  Zap,
  Flame,
  Globe,
  Award,
  Calendar,
  ArrowRight,
  Loader2,
  AlertCircle,
  Crown,
  Search,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';
import { UserStatsResponse } from '../types/index.ts';
import { formatNumber, formatStreak, getLanguageInfo, SearchHistoryItem } from '../utils/stats.ts';

const DEMO_PRESETS = [
  { username: 'luis', name: 'Luis (創業者)' },
  { username: 'tanaka_learning', name: '田中 健太' },
  { username: 'sakura_polyglot', name: 'Sakura M.' },
  { username: 'kenji_streak', name: 'KENJI' },
];

interface CompareViewProps {
  initialUser1?: string;
  initialUser2?: string;
  history?: SearchHistoryItem[];
  favorites?: string[];
  onSelectProfile: (username: string) => void;
  language: Language;
}

export default function CompareView({
  initialUser1 = '',
  initialUser2 = 'luis',
  history = [],
  favorites = [],
  onSelectProfile,
  language,
}: CompareViewProps) {
  const t = TRANSLATIONS[language];

  const [user1Query, setUser1Query] = useState(initialUser1 || 'tanaka_learning');
  const [user2Query, setUser2Query] = useState(initialUser2 || 'luis');

  const [user1Data, setUser1Data] = useState<UserStatsResponse | null>(null);
  const [user2Data, setUser2Data] = useState<UserStatsResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch comparison data for both users
  const handleRunCompare = async (u1 = user1Query, u2 = user2Query) => {
    const q1 = u1.trim();
    const q2 = u2.trim();

    if (!q1 || !q2) {
      setErrorMsg(language === 'ja' ? '2人のDuolingoユーザー名を入力してください' : 'Please provide usernames for both learners');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/user/${encodeURIComponent(q1)}`),
        fetch(`/api/user/${encodeURIComponent(q2)}`),
      ]);

      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

      if (!res1.ok) {
        throw new Error(`@${q1}: ${data1.error || 'User not found'}`);
      }
      if (!res2.ok) {
        throw new Error(`@${q2}: ${data2.error || 'User not found'}`);
      }

      setUser1Data(data1);
      setUser2Data(data2);
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'ja' ? '比較データの取得に失敗しました' : 'Failed to fetch comparison data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial comparison on mount
  useEffect(() => {
    handleRunCompare();
  }, []);

  // Shared courses analysis
  const sharedCourses = user1Data && user2Data
    ? user1Data.user.courses
        .map((c1) => {
          const c2 = user2Data.user.courses.find(
            (c) => c.learningLanguage.toLowerCase() === c1.learningLanguage.toLowerCase()
          );
          if (!c2) return null;
          return {
            langCode: c1.learningLanguage,
            info: getLanguageInfo(c1.learningLanguage),
            xp1: c1.xp,
            xp2: c2.xp,
            crowns1: c1.crowns || 0,
            crowns2: c2.crowns || 0,
          };
        })
        .filter(Boolean) as {
        langCode: string;
        info: ReturnType<typeof getLanguageInfo>;
        xp1: number;
        xp2: number;
        crowns1: number;
        crowns2: number;
      }[]
    : [];

  // Head to head scores
  let winsUser1 = 0;
  let winsUser2 = 0;

  if (user1Data && user2Data) {
    if (user1Data.user.totalXp > user2Data.user.totalXp) winsUser1++;
    else if (user2Data.user.totalXp > user1Data.user.totalXp) winsUser2++;

    if (user1Data.user.streak > user2Data.user.streak) winsUser1++;
    else if (user2Data.user.streak > user1Data.user.streak) winsUser2++;

    if (user1Data.metrics.weeklyXp > user2Data.metrics.weeklyXp) winsUser1++;
    else if (user2Data.metrics.weeklyXp > user1Data.metrics.weeklyXp) winsUser2++;

    if (user1Data.user.courses.length > user2Data.user.courses.length) winsUser1++;
    else if (user2Data.user.courses.length > user1Data.user.courses.length) winsUser2++;
  }

  // Calculate ratio percentages for comparison bars
  const getRatio = (val1: number, val2: number) => {
    const total = val1 + val2;
    if (total === 0) return { pct1: 50, pct2: 50 };
    const pct1 = Math.round((val1 / total) * 100);
    const pct2 = 100 - pct1;
    return { pct1, pct2 };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <Swords className="w-3.5 h-3.5" />
          <span>{t.compareVsBadge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.compareTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t.compareSubtitle}
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunCompare();
          }}
          className="flex flex-col md:flex-row items-center gap-3"
        >
          {/* User 1 Input */}
          <div className="w-full md:flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
              P1
            </span>
            <input
              type="text"
              value={user1Query}
              onChange={(e) => setUser1Query(e.target.value)}
              placeholder={t.user1Placeholder}
              className="w-full pl-13 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* VS Center Marker */}
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-black text-slate-500 dark:text-slate-400">
            VS
          </div>

          {/* User 2 Input */}
          <div className="w-full md:flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
              P2
            </span>
            <input
              type="text"
              value={user2Query}
              onChange={(e) => setUser2Query(e.target.value)}
              placeholder={t.user2Placeholder}
              className="w-full pl-13 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'ja' ? '照合中...' : 'Comparing...'}</span>
              </>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                <span>{t.compareBtn}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Pick Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {language === 'ja' ? 'おすすめライバル候補:' : 'Quick Picks:'}
          </span>
          {DEMO_PRESETS.map((p) => (
            <button
              key={p.username}
              type="button"
              onClick={() => {
                setUser2Query(p.username);
                handleRunCompare(user1Query, p.username);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-medium cursor-pointer"
            >
              @{p.username}
            </button>
          ))}
          {favorites.length > 0 && (
            <>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-amber-500 font-semibold">★ {language === 'ja' ? 'お気に入り:' : 'Favs:'}</span>
              {favorites.slice(0, 3).map((fav) => (
                <button
                  key={`fav-${fav}`}
                  type="button"
                  onClick={() => {
                    setUser2Query(fav);
                    handleRunCompare(user1Query, fav);
                  }}
                  className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-mono text-[11px] cursor-pointer"
                >
                  @{fav}
                </button>
              ))}
            </>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Comparison Arena */}
      {user1Data && user2Data && (
        <div className="space-y-6">
          {/* Winner Overview Banner */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-sky-500/10 dark:from-emerald-950/30 dark:via-amber-950/20 dark:to-sky-950/30 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-6 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>
                {winsUser1 > winsUser2
                  ? `@${user1Data.user.username} ${t.compareWin} (${winsUser1} / 4 項目リード)`
                  : winsUser2 > winsUser1
                  ? `@${user2Data.user.username} ${t.compareWin} (${winsUser2} / 4 項目リード)`
                  : t.compareTie}
              </span>
            </div>
          </div>

          {/* Player Cards Header Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Player 1 Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border-2 border-emerald-500/40 dark:border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                {user1Data.user.picture ? (
                  <img
                    src={user1Data.user.picture}
                    alt={user1Data.user.name || user1Data.user.username}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center flex-shrink-0">
                    {(user1Data.user.name || user1Data.user.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Player 1
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 truncate mt-1">
                    {user1Data.user.name || user1Data.user.username}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate">@{user1Data.user.username}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectProfile(user1Data.user.username)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                <span>詳細</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Player 2 Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border-2 border-sky-500/40 dark:border-sky-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                {user2Data.user.picture ? (
                  <img
                    src={user2Data.user.picture}
                    alt={user2Data.user.name || user2Data.user.username}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-600 text-white font-extrabold text-2xl flex items-center justify-center flex-shrink-0">
                    {(user2Data.user.name || user2Data.user.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                    Player 2
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 truncate mt-1">
                    {user2Data.user.name || user2Data.user.username}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate">@{user2Data.user.username}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectProfile(user2Data.user.username)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-200 hover:text-sky-600 transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                <span>詳細</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metric Battle Rows */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              {language === 'ja' ? '主要スタッツ直接対決' : 'Head-to-Head Key Metrics'}
            </h3>

            {/* Total XP Comparison */}
            {(() => {
              const { pct1, pct2 } = getRatio(user1Data.user.totalXp, user2Data.user.totalXp);
              const u1Wins = user1Data.user.totalXp >= user2Data.user.totalXp;
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-1.5 font-mono">
                      {u1Wins && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                      <span className="text-emerald-700 dark:text-emerald-400 text-sm font-black">
                        {formatNumber(user1Data.user.totalXp)} XP
                      </span>
                    </div>

                    <span className="text-slate-500 dark:text-slate-400 font-sans flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{t.metricTotalXp}</span>
                    </span>

                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-sky-600 dark:text-sky-400 text-sm font-black">
                        {formatNumber(user2Data.user.totalXp)} XP
                      </span>
                      {!u1Wins && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct1}%` }}
                    />
                    <div
                      className="h-full bg-sky-500 transition-all duration-500"
                      style={{ width: `${pct2}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Streak Comparison */}
            {(() => {
              const { pct1, pct2 } = getRatio(user1Data.user.streak, user2Data.user.streak);
              const u1Wins = user1Data.user.streak >= user2Data.user.streak;
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-1.5 font-mono">
                      {u1Wins && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                      <span className="text-emerald-700 dark:text-emerald-400 text-sm font-black">
                        {formatStreak(user1Data.user.streak)}
                      </span>
                    </div>

                    <span className="text-slate-500 dark:text-slate-400 font-sans flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      <span>{t.metricStreak}</span>
                    </span>

                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-sky-600 dark:text-sky-400 text-sm font-black">
                        {formatStreak(user2Data.user.streak)}
                      </span>
                      {!u1Wins && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                    </div>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct1}%` }}
                    />
                    <div
                      className="h-full bg-sky-500 transition-all duration-500"
                      style={{ width: `${pct2}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Weekly Gain Comparison */}
            {(() => {
              const { pct1, pct2 } = getRatio(user1Data.metrics.weeklyXp, user2Data.metrics.weeklyXp);
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700 dark:text-emerald-400 text-sm font-black font-mono">
                      +{formatNumber(user1Data.metrics.weeklyXp)} XP
                    </span>

                    <span className="text-slate-500 dark:text-slate-400 font-sans">
                      {t.metricWeeklyXp}
                    </span>

                    <span className="text-sky-600 dark:text-sky-400 text-sm font-black font-mono">
                      +{formatNumber(user2Data.metrics.weeklyXp)} XP
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct1}%` }}
                    />
                    <div
                      className="h-full bg-sky-500 transition-all duration-500"
                      style={{ width: `${pct2}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Courses Count Comparison */}
            {(() => {
              const { pct1, pct2 } = getRatio(
                user1Data.user.courses.length,
                user2Data.user.courses.length
              );
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700 dark:text-emerald-400 text-sm font-black font-mono">
                      {user1Data.user.courses.length} {language === 'ja' ? 'コース' : 'courses'}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400 font-sans flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-sky-500" />
                      <span>{t.metricCoursesCount}</span>
                    </span>

                    <span className="text-sky-600 dark:text-sky-400 text-sm font-black font-mono">
                      {user2Data.user.courses.length} {language === 'ja' ? 'コース' : 'courses'}
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct1}%` }}
                    />
                    <div
                      className="h-full bg-sky-500 transition-all duration-500"
                      style={{ width: `${pct2}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Shared Languages Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{t.compareSharedCourses} ({sharedCourses.length})</span>
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {language === 'ja' ? '双方が学習している言語コース' : 'Languages studied by both learners'}
              </span>
            </div>

            {sharedCourses.length > 0 ? (
              <div className="space-y-3">
                {sharedCourses.map((c) => {
                  const { pct1, pct2 } = getRatio(c.xp1, c.xp2);
                  const u1Wins = c.xp1 >= c.xp2;
                  return (
                    <div
                      key={c.langCode}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{c.info.flag}</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {c.info.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono font-bold">
                          <span className={`${u1Wins ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-slate-500'}`}>
                            {formatNumber(c.xp1)} XP
                          </span>
                          <span className="text-slate-300 dark:text-slate-600 font-sans">vs</span>
                          <span className={`${!u1Wins ? 'text-sky-600 dark:text-sky-400 font-black' : 'text-slate-500'}`}>
                            {formatNumber(c.xp2)} XP
                          </span>
                        </div>
                      </div>

                      {/* Progress comparison */}
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${pct1}%` }}
                        />
                        <div
                          className="h-full bg-sky-500 transition-all duration-500"
                          style={{ width: `${pct2}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
                {language === 'ja'
                  ? '共通して学習している言語コースはありません'
                  : 'No shared language courses found between these learners'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
