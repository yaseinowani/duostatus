import { Clock, Trash2, Flame, Zap, Star } from 'lucide-react';
import { SearchHistoryItem, formatNumber, formatStreak } from '../utils/stats.ts';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

interface SearchHistoryListProps {
  history: SearchHistoryItem[];
  onSelectUser: (username: string) => void;
  onRemoveItem: (username: string) => void;
  onClearHistory: () => void;
  onToggleFavorite?: (username: string) => void;
  language: Language;
}

function formatRelativeTime(timestamp: number, lang: Language): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (lang === 'en') {
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
  // Japanese
  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
}

export default function SearchHistoryList({
  history,
  onSelectUser,
  onRemoveItem,
  onClearHistory,
  onToggleFavorite,
  language,
}: SearchHistoryListProps) {
  const t = TRANSLATIONS[language];

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 text-center border border-slate-200/80 dark:border-slate-700 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
        <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 stroke-1" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.noHistoryTitle}</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
          {t.noHistoryDesc}
        </p>
      </div>
    );
  }

  // Pinned / favorite users always float to top
  const sortedHistory = [...history].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.recentSearchesTitle} ({history.length})
          </h2>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          title={t.clearHistory}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearHistory}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedHistory.map((item) => (
          <div
            key={item.username}
            onClick={() => onSelectUser(item.username)}
            className={`group p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 relative transition-all duration-200 ease-out transform-gpu hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(16,185,129,0.18)] dark:hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.6)] active:scale-[0.98] active:translate-y-0 ${
              item.isFavorite
                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-700/60 shadow-xs'
                : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-700/80 hover:border-emerald-500/80 dark:hover:border-emerald-400/80 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {item.picture ? (
                <img
                  src={item.picture}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-cover bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {(item.name || item.username).charAt(0).toUpperCase()}
                </div>
              )}

              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                    {item.name || item.username}
                  </h4>
                  {item.isFavorite && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/40">
                      ★ {t.pinnedBadge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">@{item.username}</p>

                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-0.5">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {formatNumber(item.totalXp)} XP
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-semibold">
                    <Flame className="w-3 h-3 fill-orange-500" />
                    {formatStreak(item.streak)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-1">
                {/* Star Favorite Toggle */}
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.username);
                    }}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      item.isFavorite
                        ? 'text-amber-500 hover:text-amber-600 dark:text-amber-400'
                        : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                    }`}
                    title={item.isFavorite ? t.removeFromFavorites : t.addToFavorites}
                    aria-label={item.isFavorite ? t.removeFromFavorites : t.addToFavorites}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>
                )}

                {/* Remove from history */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.username);
                  }}
                  className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
                  title={t.clearHistory}
                  aria-label={`@${item.username}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {formatRelativeTime(item.timestamp, language)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
