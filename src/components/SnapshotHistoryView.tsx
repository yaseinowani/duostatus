import { UserSnapshot } from '../utils/stats.ts';
import { formatNumber } from '../utils/stats.ts';
import { Clock, Layers, ArrowUpRight } from 'lucide-react';
import { Language } from '../utils/i18n.ts';

interface SnapshotHistoryViewProps {
  snapshots: UserSnapshot[];
  firstTrackedAt: string;
  lastUpdatedAt: string;
  language?: Language;
}

export default function SnapshotHistoryView({
  snapshots,
  firstTrackedAt,
  lastUpdatedAt,
  language = 'ja',
}: SnapshotHistoryViewProps) {
  // Sort descending (latest first)
  const sorted = [...snapshots].sort((a, b) => b.timestamp - a.timestamp);

  const firstDate = firstTrackedAt
    ? new Date(firstTrackedAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const lastDate = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'ja' ? '計測スナップショット履歴' : 'Recorded Snapshot History'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ja'
              ? `アクセス時に記録されたスナップショットログ（合計 ${snapshots.length} 件）`
              : `Total of ${snapshots.length} snapshots recorded during sessions`}
          </p>
        </div>

        <div className="text-right text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
          <div>
            {language === 'ja' ? '初回記録:' : 'First Recorded:'}{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{firstDate || '-'}</span>
          </div>
          <div>
            {language === 'ja' ? '最終更新:' : 'Last Synced:'}{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{lastDate || '-'}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
              <th className="pb-3 px-3">{language === 'ja' ? '記録日時' : 'Timestamp'}</th>
              <th className="pb-3 px-3 text-right">{language === 'ja' ? '総XP' : 'Total XP'}</th>
              <th className="pb-3 px-3 text-right">{language === 'ja' ? '前回差分' : 'Delta Gain'}</th>
              <th className="pb-3 px-3 text-right">{language === 'ja' ? 'ストリーク' : 'Streak'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {sorted.map((snap, index) => {
              const prev = index < sorted.length - 1 ? sorted[index + 1] : null;
              const gain = prev ? snap.totalXp - prev.totalXp : 0;
              const formattedDate = new Date(snap.timestamp).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr key={snap.timestamp || index} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{formattedDate}</span>
                    {index === 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded">
                        {language === 'ja' ? '最新' : 'Latest'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                    {formatNumber(snap.totalXp)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">XP</span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono tabular-nums">
                    {prev ? (
                      gain > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />+{formatNumber(gain)} XP
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">±0 XP</span>
                      )
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-sans">
                        {language === 'ja' ? '初回計測基準' : 'Initial Baseline'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-orange-600 dark:text-orange-400 font-mono tabular-nums">
                    {snap.streak > 0 ? `${snap.streak}${language === 'ja' ? '日' : 'd'}` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
