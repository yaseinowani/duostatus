import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, ArrowRight, Flame, Zap, Star } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';
import { SearchHistoryItem, formatNumber, formatStreak } from '../utils/stats.ts';

const DEMO_SUGGESTIONS: SearchHistoryItem[] = [
  {
    username: 'tanaka_learning',
    name: '田中 健太',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalXp: 96829,
    streak: 416,
    timestamp: Date.now(),
  },
  {
    username: 'luis',
    name: 'Luis',
    picture: 'https://d3gq3s1iyyx31w.cloudfront.net/static/render/bg/BackgroundColor-15/Body-1/ClothingColor-9/CostumeArtboard-70/Expression-47/EyeColor-1/FacialHair-0/FacialHairColor-1/Glasses-1/GlassesColor-8/HasCostume-1/Headwear-0/HeadwearColor-1/MainHair-66/MainHairColor-2/Nose%20Piercing-0/Piercings-0/SkinTone-2/Wrinkles-0/xlarge',
    totalXp: 394528,
    streak: 3986,
    timestamp: Date.now(),
  },
  {
    username: 'sakura_polyglot',
    name: 'Sakura M.',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    totalXp: 136500,
    streak: 730,
    timestamp: Date.now(),
  },
  {
    username: 'kenji_streak',
    name: 'KENJI',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalXp: 245800,
    streak: 1280,
    timestamp: Date.now(),
  },
];

interface UserSearchFormProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  initialValue?: string;
  className?: string;
  language: Language;
  history?: SearchHistoryItem[];
}

export default function UserSearchForm({
  onSearch,
  isLoading,
  initialValue = '',
  className = '',
  language,
  history = [],
}: UserSearchFormProps) {
  const [username, setUsername] = useState(initialValue);
  const [validationError, setValidationError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  // Merge history and demo suggestions without duplicates
  const allCandidates: SearchHistoryItem[] = [...history];
  for (const demo of DEMO_SUGGESTIONS) {
    if (!allCandidates.some((c) => c.username.toLowerCase() === demo.username.toLowerCase())) {
      allCandidates.push(demo);
    }
  }

  // Filter based on input
  const query = username.trim().toLowerCase();
  const filteredSuggestions = allCandidates.filter((item) => {
    if (!query) return true;
    return (
      item.username.toLowerCase().includes(query) ||
      (item.name && item.name.toLowerCase().includes(query))
    );
  }).slice(0, 5);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (selectedUsername: string) => {
    setUsername(selectedUsername);
    setIsDropdownOpen(false);
    setValidationError('');
    onSearch(selectedUsername);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (focusedIndex >= 0 && focusedIndex < filteredSuggestions.length) {
      handleSelectSuggestion(filteredSuggestions[focusedIndex].username);
      return;
    }
    const trimmed = username.trim();
    if (!trimmed) {
      setValidationError(t.searchRequired);
      return;
    }
    setValidationError('');
    setIsDropdownOpen(false);
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`w-full relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/90 dark:border-slate-700 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-200">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3.5 absolute pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={username}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsDropdownOpen(true);
                setFocusedIndex(-1);
                if (validationError) setValidationError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder={t.searchPlaceholder}
              aria-label="Duolingo username"
              className="w-full pl-11 pr-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-none text-base font-medium bg-transparent"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.searchLoading}</span>
              </>
            ) : (
              <>
                <span>{t.searchSubmitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Autocomplete / Suggestions Floating Dropdown */}
        {isDropdownOpen && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3.5 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>{t.suggestionsTitle}</span>
              <span className="font-mono text-[10px]">↑↓ で選択 · Enter で決定</span>
            </div>

            <div className="p-1 space-y-0.5 max-h-64 overflow-y-auto">
              {filteredSuggestions.map((item, index) => {
                const isSelected = index === focusedIndex;
                return (
                  <button
                    key={`sugg-${item.username}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.username)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {item.picture ? (
                        <img
                          src={item.picture}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100 dark:bg-slate-700 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {(item.name || item.username).charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {item.name || item.username}
                          </span>
                          {item.isFavorite && (
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          @{item.username}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                      <span className="flex items-center gap-0.5">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {formatNumber(item.totalXp)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-semibold">
                        <Flame className="w-3 h-3 fill-orange-500" />
                        {formatStreak(item.streak)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {validationError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-semibold pl-2">{validationError}</p>
        )}

        {/* Safe Verification & ToS Compliance Badge */}
        <div className="mt-3 flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 pl-1 select-none">
          <span>{t.searchComplianceBadge}</span>
        </div>
      </form>
    </div>
  );
}
