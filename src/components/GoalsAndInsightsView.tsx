import React, { useState } from 'react';
import {
  Target,
  Flame,
  Zap,
  Award,
  Crown,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Globe,
  Footprints,
  Clock,
} from 'lucide-react';
import { UserStatsResponse } from '../types/index.ts';
import {
  formatNumber,
  formatStreak,
  calculateMilestones,
  calculateAchievementBadges,
} from '../utils/stats.ts';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

interface GoalsAndInsightsViewProps {
  stats: UserStatsResponse | null;
  onNavigateToSearch: () => void;
  language: Language;
}

export default function GoalsAndInsightsView({ stats, onNavigateToSearch, language }: GoalsAndInsightsViewProps) {
  const [weeklyGoalInput, setWeeklyGoalInput] = useState<number>(1000);
  const t = TRANSLATIONS[language];

  if (!stats) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 dark:border-slate-700 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] space-y-4 max-w-2xl mx-auto">
        <Target className="w-12 h-12 text-emerald-700 dark:text-emerald-400 mx-auto stroke-1" />
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'ja' ? 'ユーザーの統計を選択してください' : 'Select a user to view goals & insights'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'ja'
            ? '目標管理やマイルストーン予測、称号バッジを表示するには、まず上部の検索バーからDuolingoユーザー名を入力して統計を表示してください。'
            : 'To track weekly goals, milestone forecasts, and achievement badges, please search for a Duolingo username above.'}
        </p>
        <div className="pt-2">
          <button
            onClick={onNavigateToSearch}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {t.navSearch}
          </button>
        </div>
      </div>
    );
  }

  const { user, metrics, snapshots } = stats;
  const milestones = calculateMilestones(user.streak, user.totalXp);
  const badges = calculateAchievementBadges(user.totalXp, user.streak, user.courses?.length || 1);

  // Goal calculation
  const weeklyEarned = metrics.weeklyXp || 0;
  const goalProgressPercent = Math.min(100, Math.round((weeklyEarned / weeklyGoalInput) * 100));
  const remainingForGoal = Math.max(0, weeklyGoalInput - weeklyEarned);
  const dailyNeeded = Math.ceil(remainingForGoal / 7);

  // Milestone projected date
  const nextTargetDate = new Date();
  nextTargetDate.setDate(nextTargetDate.getDate() + milestones.streakDaysRemaining);
  const nextTargetDateStr = nextTargetDate.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const badgeIcons: Record<string, React.ReactNode> = {
    Footprints: <Footprints className="w-5 h-5" />,
    Flame: <Flame className="w-5 h-5" />,
    Globe: <Globe className="w-5 h-5" />,
    CalendarCheck: <CalendarCheck className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Award: <Award className="w-5 h-5" />,
    Crown: <Crown className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-2">
            <Target className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{language === 'ja' ? '学習目標 · 継続マイルストーン · 称号実績' : 'Learning Goals · Milestones · Badges'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            @{user.username} {language === 'ja' ? 'の学習インサイト' : '’s Learning Insights'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {language === 'ja'
              ? '日々の学習目標の進捗、ストリーク達成予測、獲得可能な称号バッジを一覧できます。'
              : 'Monitor weekly target pace, forecast milestone reach dates, and unlock achievement badges.'}
          </p>
        </div>

        <div className="text-right flex items-center gap-3">
          <div className="p-3 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-700 text-right">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">{t.metricTotalXp}</span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {formatNumber(user.totalXp)} XP
            </span>
          </div>
          <div className="p-3 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-700 text-right">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">{t.metricStreak}</span>
            <span className="text-base font-black text-orange-600 dark:text-orange-400 font-mono tabular-nums">
              {formatStreak(user.streak)}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Weekly XP Goal Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>{language === 'ja' ? '週間獲得XP目標トラッカー' : 'Weekly XP Goal Tracker'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'ja' ? '1週間の学習目標を設定し、ペースと達成率を可視化します' : 'Set your 7-day target and monitor pace toward completion'}
            </p>
          </div>

          {/* Goal Presets */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs">
            {[500, 1000, 2000, 3000].map((preset) => (
              <button
                key={preset}
                onClick={() => setWeeklyGoalInput(preset)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  weeklyGoalInput === preset
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {preset} XP
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar & Details */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between text-xs sm:text-sm">
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {language === 'ja' ? '今週の獲得実績: ' : 'Weekly Progress: '}
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold font-mono tabular-nums text-lg">
                +{formatNumber(weeklyEarned)}
              </span>{' '}
              <span className="text-slate-400 dark:text-slate-500 font-sans">/ {formatNumber(weeklyGoalInput)} XP</span>
            </div>
            <div className="font-black text-emerald-800 dark:text-emerald-400 font-mono tabular-nums text-lg">
              {goalProgressPercent}%
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-3 rounded-full transition-all duration-700"
              style={{ width: `${goalProgressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block font-medium">
                {language === 'ja' ? '目標達成まで' : 'Remaining XP'}
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums mt-0.5 block">
                {remainingForGoal === 0
                  ? (language === 'ja' ? '達成完了！🎉' : 'Goal Completed! 🎉')
                  : `+${formatNumber(remainingForGoal)} XP`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block font-medium">
                {language === 'ja' ? '1日あたり必要ペース' : 'Required Daily Pace'}
              </span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums mt-0.5 block">
                {remainingForGoal === 0
                  ? (language === 'ja' ? '余裕をもって継続中' : 'Well on track')
                  : `~${dailyNeeded} XP / ${language === 'ja' ? '日' : 'day'}`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block font-medium">
                {language === 'ja' ? '計測スナップショット' : 'Recorded Snapshots'}
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums mt-0.5 block">
                {snapshots.length} {language === 'ja' ? '件記録済み' : 'logged'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Streak & XP Milestone Forecast */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span>{language === 'ja' ? 'ストリーク＆マイルストーン到達予測' : 'Streak & Milestone Forecasts'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'ja' ? '日々の継続が紡ぐ節目と次の目標へのカウントダウン' : 'Countdown and estimated calendar dates for upcoming milestones'}
          </p>
        </div>

        {/* Highlight Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-slate-900 dark:to-slate-900 border border-amber-200/70 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
              {language === 'ja' ? '次の大台マイルストーン' : 'Upcoming Major Milestone'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {milestones.nextStreakTarget} {language === 'ja' ? '日連続学習' : 'Days Streak'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {language === 'ja' ? (
                <>このまま毎日継続すると、<strong className="text-slate-800 dark:text-slate-200 font-semibold">{nextTargetDateStr}</strong> 頃に達成見込みです。</>
              ) : (
                <>At current daily rate, estimated to be reached around <strong className="text-slate-800 dark:text-slate-200 font-semibold">{nextTargetDateStr}</strong>.</>
              )}
            </p>
          </div>

          <div className="text-right bg-white/80 dark:bg-slate-800/90 backdrop-blur-xs px-5 py-3 rounded-2xl border border-amber-200/80 dark:border-amber-700/60 flex-shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              {language === 'ja' ? '達成まであと' : 'Days Remaining'}
            </span>
            <span className="text-3xl font-black text-orange-600 dark:text-orange-400 font-mono tabular-nums">
              {milestones.streakDaysRemaining}
              <span className="text-xs text-slate-600 dark:text-slate-400 font-normal font-sans ml-1">
                {language === 'ja' ? '日' : 'days'}
              </span>
            </span>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {milestones.streakMilestones.slice(0, 8).map((m) => (
            <div
              key={m.target}
              className={`p-3.5 rounded-2xl border text-xs transition-colors ${
                m.isReached
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200/70 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-700/80 text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold">{m.target}{language === 'ja' ? '日' : 'd'}</span>
                {m.isReached ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                )}
              </div>
              <span className="text-[11px] block">
                {m.isReached ? (
                  <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    {language === 'ja' ? '達成済み ✓' : 'Reached ✓'}
                  </strong>
                ) : (
                  language === 'ja' ? `あと ${m.remainingDays} 日` : `${m.remainingDays}d to go`
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Achievement Badges Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <span>
              {language === 'ja' ? '称号＆学習実績バッジ' : 'Achievements & Badges'} ({badges.filter((b) => b.isUnlocked).length} / {badges.length} {language === 'ja' ? 'アンロック' : 'unlocked'})
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'ja' ? '学習量（総XP）・継続日数（ストリーク）・言語の多様性に応じた称号コレクション' : 'Earn badges based on lifetime XP, streak commitments, and polyglot variety'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                b.isUnlocked
                  ? 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 shadow-xs'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: b.isUnlocked ? b.color : '#64748b' }}
                  >
                    {badgeIcons[b.iconName] || <Sparkles className="w-5 h-5" />}
                  </div>

                  {b.isUnlocked ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {language === 'ja' ? '獲得済' : 'Unlocked'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500">
                      {b.progressPercent}%
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {b.description}
                </p>
              </div>

              {!b.isUnlocked && (
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-400 dark:bg-slate-500 h-1.5 rounded-full"
                      style={{ width: `${b.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
