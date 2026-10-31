import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { UserStatsResponse } from '../types/index.ts';
import { formatNumber, formatChartData, generateDemoSnapshots } from '../utils/stats.ts';
import { BarChart3, TrendingUp, Info, Eye } from 'lucide-react';
import { Language } from '../utils/i18n.ts';
import StudyHeatmapCalendar from './StudyHeatmapCalendar.tsx';

interface StatsViewProps {
  stats: UserStatsResponse;
  language?: Language;
}

export default function StatsView({ stats, language = 'ja' }: StatsViewProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [chartType, setChartType] = useState<'cumulative' | 'dailyGain'>('cumulative');
  const [showDemoPreview, setShowDemoPreview] = useState(false);

  const { snapshots, user } = stats;

  const isSingleSnapshot = snapshots.length <= 1;

  const chartSnapshots = useMemo(() => {
    if (isSingleSnapshot && showDemoPreview) {
      return generateDemoSnapshots(user.totalXp, user.streak, 30);
    }
    return snapshots;
  }, [snapshots, isSingleSnapshot, showDemoPreview, user.totalXp, user.streak]);

  const chartData = useMemo(() => {
    return formatChartData(chartSnapshots, period, chartType);
  }, [chartSnapshots, period, chartType]);

  const gainsSum = chartData.reduce((acc, curr) => acc + curr.dailyGain, 0);
  const avgDailyGain = chartData.length > 1 ? Math.round(gainsSum / (chartData.length - 1)) : 0;

  return (
    <div className="space-y-6">
      {/* Informational Banner */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 sm:p-5 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              {language === 'ja' ? 'XP推移の算出基準' : 'XP Trend Calculation Basis'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {language === 'ja' ? (
                <>
                  Duolingo公開APIには過去の日別カレンダー履歴が含まれないため、DuoStatsでは
                  <strong>記録時の総XPスナップショット差分</strong>
                  から日別・週別の獲得XP推移を安全に算出しています。
                </>
              ) : (
                <>
                  Because Duolingo’s public profile endpoint omits past calendar histories, DuoStats safely measures daily and weekly gain strictly from delta snapshots of cumulative total XP.
                </>
              )}
            </p>
            {isSingleSnapshot && !showDemoPreview && (
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowDemoPreview(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ja'
                      ? 'グラフ表示イメージを確認する（30日デモ推移）'
                      : 'Preview chart appearance with 30-day demo curve'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSingleSnapshot && showDemoPreview && (
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {language === 'ja' ? '現在、グラフ表示イメージ用デモ推移を表示しています' : 'Currently showing demo curve preview'}
          </span>
          <button
            onClick={() => setShowDemoPreview(false)}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-400 underline hover:text-emerald-950 dark:hover:text-emerald-300 cursor-pointer"
          >
            {language === 'ja' ? '実データ表示（1件）に戻す' : 'Return to actual data (1 item)'}
          </button>
        </div>
      )}

      {/* Main Chart Card (Nordic clean design) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700">
        {/* Controls Bar: Period and Mode Selectors */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>
                {chartType === 'cumulative'
                  ? (language === 'ja' ? '累計XP推移グラフ' : 'Cumulative Total XP Chart')
                  : (language === 'ja' ? '日別獲得XPグラフ' : 'Daily Gained XP Chart')}
              </span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {chartData.length} {language === 'ja' ? '件のデータポイント' : 'data points'} ({period === 'all' ? (language === 'ja' ? '全期間' : 'All') : `${period}`})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => setChartType('cumulative')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  chartType === 'cumulative'
                    ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {language === 'ja' ? '累計XP' : 'Cumulative'}
              </button>
              <button
                type="button"
                onClick={() => setChartType('dailyGain')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  chartType === 'dailyGain'
                    ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {language === 'ja' ? '日別獲得XP' : 'Daily Gain'}
              </button>
            </div>

            {/* Period Selector */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              {(['7d', '30d', '90d', 'all'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    period === p
                      ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {p === '7d' ? (language === 'ja' ? '7日' : '7d') : p === '30d' ? (language === 'ja' ? '30日' : '30d') : p === '90d' ? (language === 'ja' ? '90日' : '90d') : (language === 'ja' ? '全期間' : 'All')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Render */}
        <div className="mt-6 h-72 sm:h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'cumulative' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="xpAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="shortDate"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#475569' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val >= 1000 ? `${Math.round(val / 1000)}k` : val)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      border: '1px solid #475569',
                      boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.4)',
                      fontSize: '12px',
                      color: '#f8fafc',
                      fontWeight: 600,
                    }}
                    formatter={(value: any) => [`${formatNumber(Number(value))} XP`, 'XP']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalXp"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#xpAreaGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="shortDate"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#475569' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      border: '1px solid #475569',
                      boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.4)',
                      fontSize: '12px',
                      color: '#f8fafc',
                      fontWeight: 600,
                    }}
                    formatter={(value: any) => [`+${formatNumber(Number(value))} XP`, 'Gained']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="dailyGain" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <BarChart3 className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-xs font-semibold">{language === 'ja' ? '表示できる推移データがまだありません' : 'No trend data points recorded yet'}</p>
            </div>
          )}
        </div>

        {/* Supplementary Metrics */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ja' ? '選択期間内の獲得XP' : 'XP Gained in Period'}
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5 font-mono tabular-nums">
              +{formatNumber(gainsSum)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">XP</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ja' ? '1日あたり平均獲得XP' : 'Average Daily Gain'}
            </span>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono tabular-nums">
              +{formatNumber(avgDailyGain)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">XP/{language === 'ja' ? '日' : 'day'}</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ja' ? '記録スナップショット' : 'Recorded Snapshots'}
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5 font-mono tabular-nums">
              {chartData.length} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">{language === 'ja' ? '件' : 'items'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style Learning Heatmap Calendar (草グラフ) */}
      <StudyHeatmapCalendar
        snapshots={snapshots}
        totalXp={user.totalXp}
        streak={user.streak}
        language={language}
      />
    </div>
  );
}
