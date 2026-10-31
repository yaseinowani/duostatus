import { useState, useMemo } from 'react';
import { CourseData } from '../utils/stats.ts';
import { aggregateLanguageStats, formatNumber, getLanguageInfo } from '../utils/stats.ts';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { Globe, Award, BookOpen, PieChart as PieIcon, Hexagon } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

interface LanguageBreakdownViewProps {
  courses: CourseData[];
  language?: Language;
}

export default function LanguageBreakdownView({ courses, language = 'ja' }: LanguageBreakdownViewProps) {
  const [viewMode, setViewMode] = useState<'donut' | 'radar'>('radar');
  const t = TRANSLATIONS[language];
  const aggregated = useMemo(() => aggregateLanguageStats(courses), [courses]);

  const totalCourseXp = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.xp || 0), 0);
  }, [courses]);

  const totalCrowns = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.crowns || 0), 0);
  }, [courses]);

  const pieData = aggregated.map((item) => ({
    name: item.displayName,
    value: item.xp,
    percentage: item.percentage,
    color: item.color,
    flag: item.flag,
  }));

interface RadarItem {
  subject: string;
  skillValue: number;
  rawXp?: number;
  percentage?: number;
  crowns?: number;
  displayVal?: string;
}

  // Prepare radar chart data
  const radarData: RadarItem[] = useMemo(() => {
    if (aggregated.length >= 3) {
      // Multi-language learner: each vertex is a language
      const maxXp = Math.max(...aggregated.map((a) => a.xp), 1);
      return aggregated.map((item) => ({
        subject: `${item.flag} ${item.displayName}`,
        skillValue: Math.round((item.xp / maxXp) * 100),
        rawXp: item.xp,
        percentage: item.percentage,
        crowns: item.crowns,
      }));
    } else {
      // 1 or 2 languages: multi-dimensional skill metrics
      const primary = aggregated[0] || { xp: 0, crowns: 0, percentage: 100, displayName: 'Main' };
      const xpScore = Math.min(100, Math.round((primary.xp / 100000) * 100));
      const crownScore = Math.min(100, Math.round(((primary.crowns || 0) / 200) * 100));
      const consistencyScore = 85;
      const vocabularyScore = Math.min(100, Math.round((primary.xp / 120000) * 100 + 20));
      const fluencyScore = Math.min(100, Math.round(((primary.crowns || 1) / 150) * 80 + 25));

      return [
        {
          subject: language === 'ja' ? 'XP習得度' : 'XP Mastery',
          skillValue: Math.max(35, xpScore),
          displayVal: `${formatNumber(primary.xp)} XP`,
        },
        {
          subject: language === 'ja' ? 'クラウン達成' : 'Crowns Achieved',
          skillValue: Math.max(30, crownScore),
          displayVal: `${primary.crowns || 0} 個`,
        },
        {
          subject: language === 'ja' ? '継続学習力' : 'Consistency',
          skillValue: consistencyScore,
          displayVal: `${consistencyScore}%`,
        },
        {
          subject: language === 'ja' ? '語彙リーチ' : 'Vocabulary Reach',
          skillValue: Math.max(40, vocabularyScore),
          displayVal: `${vocabularyScore} pt`,
        },
        {
          subject: language === 'ja' ? 'コース習熟度' : 'Course Fluency',
          skillValue: Math.max(45, fluencyScore),
          displayVal: `${fluencyScore}%`,
        },
      ];
    }
  }, [aggregated, language]);

  return (
    <div className="space-y-6">
      {/* Overview Cards & Chart (Radar or Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric summary */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>{language === 'ja' ? '言語別XPのサマリー' : 'Language XP Summary'}</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {language === 'ja' ? '学習中の全言語コースの合算統計' : 'Aggregated lifetime metrics across courses'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">
                {language === 'ja' ? 'コース合算 XP' : 'Courses Combined XP'}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 font-mono tabular-nums">
                {formatNumber(totalCourseXp)} <span className="text-xs font-normal text-slate-500 font-sans">XP</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">
                {language === 'ja' ? '獲得クラウン合計' : 'Total Crowns Earned'}
              </span>
              <div className="text-2xl font-black text-amber-500 mt-0.5 font-mono tabular-nums flex items-center gap-1.5">
                <Award className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{formatNumber(totalCrowns)}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">
                {language === 'ja' ? '学習言語数' : 'Courses Enrolled'}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 font-mono tabular-nums">
                {courses.length} <span className="text-xs font-normal text-slate-500 font-sans">{language === 'ja' ? 'コース' : 'languages'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Chart Card: Toggle between Radar and Donut */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {viewMode === 'radar' ? (
                  <Hexagon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                )}
                <span>
                  {viewMode === 'radar' ? t.radarChartTitle : (language === 'ja' ? '言語別XP比率' : 'XP Distribution by Language')}
                </span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {viewMode === 'radar' ? t.radarChartDesc : (language === 'ja' ? '全獲得XPに対する各言語の比率' : 'Proportional share of total XP earned across languages')}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl flex-shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('radar')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'radar'
                    ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Hexagon className="w-3.5 h-3.5" />
                <span>{t.radarViewToggle}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('donut')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'donut'
                    ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>{t.barViewToggle}</span>
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-64 sm:h-72 w-full mt-4 flex flex-col sm:flex-row items-center justify-around">
            {viewMode === 'radar' ? (
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#475569" strokeDasharray="3 3" opacity={0.35} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        border: '1px solid #475569',
                        fontSize: '12px',
                        color: '#f8fafc',
                        fontWeight: 600,
                      }}
                      formatter={(val: any, _name: any, item: any) => [
                        item.payload.displayVal || `${formatNumber(item.payload.rawXp || Number(val))} XP (${item.payload.skillValue}%)`,
                        'スコア / XP',
                      ]}
                    />
                    <Radar
                      name="習熟スキル"
                      dataKey="skillValue"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <>
                <div className="w-full sm:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderRadius: '12px',
                          border: '1px solid #475569',
                          fontSize: '12px',
                          color: '#f8fafc',
                          fontWeight: 600,
                        }}
                        formatter={(val: any) => [`${formatNumber(Number(val))} XP`, 'XP']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend List */}
                <div className="w-full sm:w-1/2 space-y-2 mt-4 sm:mt-0 pl-0 sm:pl-4">
                  {aggregated.slice(0, 5).map((item) => (
                    <div key={item.learningLanguage} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.displayName}</span>
                      </div>
                      <div className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">{formatNumber(item.xp)} XP</strong>
                        <span className="text-[11px] ml-1.5 opacity-80">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Course Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          {language === 'ja' ? '全コース詳細リスト' : 'Course Details'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aggregated.map((course) => {
            const info = getLanguageInfo(course.learningLanguage);

            return (
              <div
                key={course.id || course.learningLanguage}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info.flag}</span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{info.name}</h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {course.title} · {course.fromLanguage?.toUpperCase()} {language === 'ja' ? '話者向け' : 'speakers'}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {course.percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${course.percentage}%`,
                        backgroundColor: info.color,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                      {language === 'ja' ? 'コース獲得XP' : 'Course XP'}
                    </span>
                    <span className="font-black text-slate-900 dark:text-slate-100 text-sm font-mono tabular-nums">
                      {formatNumber(course.xp)} XP
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                      {language === 'ja' ? '獲得クラウン' : 'Crowns'}
                    </span>
                    <span className="font-bold text-amber-500 flex items-center justify-end gap-1 font-mono tabular-nums text-sm">
                      <Award className="w-3.5 h-3.5 fill-amber-500" />
                      {formatNumber(course.crowns || 0)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
