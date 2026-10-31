import { useState } from 'react';
import {
  Flame,
  Zap,
  Globe,
  Calendar,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  Star,
  Swords,
} from 'lucide-react';
import { UserStatsResponse } from '../types/index.ts';
import { formatNumber, formatStreak } from '../utils/stats.ts';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

interface UserProfileHeaderProps {
  stats: UserStatsResponse;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenQuickLog: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (username: string) => void;
  onOpenCompare?: (username: string) => void;
  language: Language;
}

export default function UserProfileHeader({
  stats,
  onRefresh,
  isRefreshing,
  onOpenQuickLog,
  isFavorite = false,
  onToggleFavorite,
  onOpenCompare,
  language,
}: UserProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const { user, isReal, firstTrackedAt, lastUpdatedAt, metrics, notice } = stats;
  const t = TRANSLATIONS[language];

  const joinDateStr = user.creationDate
    ? new Date(user.creationDate * 1000).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric',
        month: 'long',
      })
    : '';

  const lastUpdatedStr = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const initialLetter = (user.name || user.username || 'D').charAt(0).toUpperCase();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700">
      {/* Top Banner: Status & Compliance Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {isReal ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'ja' ? 'Duolingo公開プロフィール（非公式照合）' : 'Public Profile (Unofficial)'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>{language === 'ja' ? 'デモデータ（サンプル表示）' : 'Demo Profile'}</span>
            </span>
          )}

          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>

          <span className="text-slate-500 dark:text-slate-400">
            {language === 'ja' ? '計測スナップショット:' : 'Snapshots:'}{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">{metrics.snapshotCount}</strong>
          </span>

          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>

          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {language === 'ja' ? '非公式ファンプロジェクト' : 'Unofficial Fan Project'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Favorite Star Button */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(user.username)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/60 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-600 hover:text-amber-500'
              }`}
              title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>{isFavorite ? (language === 'ja' ? 'お気に入り' : 'Bookmarked') : (language === 'ja' ? 'お気に入り' : 'Favorite')}</span>
            </button>
          )}

          {/* VS Compare Button */}
          {onOpenCompare && (
            <button
              onClick={() => onOpenCompare(user.username)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200/80 dark:border-slate-600 cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'ja' ? 'VS 比較' : 'VS Compare'}</span>
            </button>
          )}

          <button
            onClick={onOpenQuickLog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === 'ja' ? '本日の学習を記録 (+XP)' : 'Log Session (+XP)'}</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200/80 dark:border-slate-600 disabled:opacity-50 cursor-pointer"
            title={language === 'ja' ? '公開プロフィールとオンデマンド照合します' : 'Check with Duolingo public profile'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-400'}`} />
            <span>{isRefreshing ? (language === 'ja' ? '照合中...' : 'Syncing...') : (language === 'ja' ? '公開データと照合' : 'Sync Profile')}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="mt-4 p-3.5 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{notice}</p>
        </div>
      )}

      {/* Main Profile Row */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar */}
          <div className="relative">
            {user.picture && !imageError ? (
              <img
                src={user.picture}
                alt={user.name || user.username}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-700"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-sm select-none">
                {initialLetter}
              </div>
            )}
            {user.streak > 0 && (
              <div
                className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-xl px-2 py-0.5 text-xs font-black shadow-sm flex items-center gap-0.5 border-2 border-white dark:border-slate-800"
                title={`${user.streak}d streak`}
              >
                <Flame className="w-3.5 h-3.5 text-white fill-white" />
                <span>{user.streak}</span>
              </div>
            )}
          </div>

          {/* Name & Bio */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {user.name || user.username}
              </h1>
              {isFavorite && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/40">
                  ★ {t.pinnedBadge}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">@{user.username}</p>

            {user.bio ? (
              <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed whitespace-pre-wrap">{user.bio}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {language === 'ja' ? '自己紹介は未設定です' : 'No bio available'}
              </p>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              {joinDateStr && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{joinDateStr} {language === 'ja' ? 'から学習' : 'joined'}</span>
                </span>
              )}
              {joinDateStr && lastUpdatedStr && <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>}
              {lastUpdatedStr && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{language === 'ja' ? '最終更新:' : 'Last updated:'} {lastUpdatedStr}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{t.metricTotalXp}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-mono tabular-nums">
            {formatNumber(user.totalXp)}
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 font-sans">XP</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{t.metricTotalXpDesc}</p>
        </div>

        {/* Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{t.metricStreak}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tight font-mono tabular-nums">
            {formatStreak(user.streak)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{t.metricStreakDesc}</p>
        </div>

        {/* Weekly Gain */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[9px]">
              W
            </span>
            <span>{t.metricWeeklyXp}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight font-mono tabular-nums">
            {metrics.isMeasured ? (
              <>
                +{formatNumber(metrics.weeklyXp)}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 font-sans">XP</span>
              </>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-lg font-sans">
                {language === 'ja' ? '未計測 (0 XP)' : 'Unmeasured (0 XP)'}
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {metrics.isMeasured
              ? `${metrics.daysSpan} ${language === 'ja' ? '日間の計測差分' : 'days measured'}`
              : (language === 'ja' ? '2回目以降の計測・記録から算出' : 'Calculated after next session')}
          </p>
        </div>

        {/* Languages Count */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{t.metricCoursesCount}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-mono tabular-nums">
            {metrics.languagesCount}
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 font-sans">
              {language === 'ja' ? 'コース' : 'courses'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{t.metricCoursesDesc}</p>
        </div>
      </div>
    </div>
  );
}
