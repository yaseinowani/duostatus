/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import Navbar, { ActiveNavPage } from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import TextReelHeadline from './components/TextReelHeadline.tsx';
import UserSearchForm from './components/UserSearchForm.tsx';
import SearchHistoryList from './components/SearchHistoryList.tsx';
import UserProfileHeader from './components/UserProfileHeader.tsx';
import StatsView from './components/StatsView.tsx';
import LanguageBreakdownView from './components/LanguageBreakdownView.tsx';
import SnapshotHistoryView from './components/SnapshotHistoryView.tsx';
import GoalsAndInsightsView from './components/GoalsAndInsightsView.tsx';
import AboutView from './components/AboutView.tsx';
import CompareView from './components/CompareView.tsx';
import QuickLogModal from './components/QuickLogModal.tsx';
import { UserStatsResponse } from './types/index.ts';
import { SearchHistoryItem } from './utils/stats.ts';
import { Language, TRANSLATIONS } from './utils/i18n.ts';
import {
  Target,
  Zap,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  BarChart2,
  Layers,
  Globe,
} from 'lucide-react';

const SEARCH_HISTORY_KEY = 'duostats_search_history';
const FAVORITES_KEY = 'duostats_favorites';
const THEME_STORAGE_KEY = 'duostats_theme';
const LANG_STORAGE_KEY = 'duostats_lang';

const INITIAL_HISTORY_SEEDS: SearchHistoryItem[] = [
  {
    username: 'tanaka_learning',
    name: '田中 健太',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalXp: 96829,
    streak: 416,
    timestamp: Date.now() - 1000 * 60 * 25,
  },
  {
    username: 'luis',
    name: 'Luis',
    picture: 'https://d3gq3s1iyyx31w.cloudfront.net/static/render/bg/BackgroundColor-15/Body-1/ClothingColor-9/CostumeArtboard-70/Expression-47/EyeColor-1/FacialHair-0/FacialHairColor-1/Glasses-1/GlassesColor-8/HasCostume-1/Headwear-0/HeadwearColor-1/MainHair-66/MainHairColor-2/Nose%20Piercing-0/Piercings-0/SkinTone-2/Wrinkles-0/xlarge',
    totalXp: 394528,
    streak: 3986,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    username: 'sakura_polyglot',
    name: 'Sakura M.',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    totalXp: 136500,
    streak: 730,
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export default function App() {
  const [activePage, setActivePage] = useState<ActiveNavPage>('home');
  const [profileTab, setProfileTab] = useState<'stats' | 'languages' | 'snapshots'>('stats');

  // Language state (ja / en)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'ja' || saved === 'en') return saved;
    } catch (e) {
      console.warn(e);
    }
    return 'ja';
  });

  // Dark mode state (defaults to dark to match video)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) return saved === 'dark';
      return true;
    } catch (e) {
      return true;
    }
  });

  const [currentStats, setCurrentStats] = useState<UserStatsResponse | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Log Modal State
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read favorites', e);
    }
    return ['luis'];
  });

  // Compare active users state
  const [compareUser1, setCompareUser1] = useState<string>('');
  const [compareUser2, setCompareUser2] = useState<string>('luis');

  // Search history state
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read search history', e);
    }
    return INITIAL_HISTORY_SEEDS;
  });

  // Notification message
  const [notification, setNotification] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Synchronize favorites with search history items
  const searchHistoryWithFavorites = searchHistory.map((item) => ({
    ...item,
    isFavorite: favorites.includes(item.username.toLowerCase()),
  }));

  const handleToggleFavorite = (username: string) => {
    const lower = username.toLowerCase();
    setFavorites((prev) => {
      const exists = prev.includes(lower);
      const next = exists ? prev.filter((u) => u !== lower) : [...prev, lower];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      showToast(
        exists
          ? `@${username} ${language === 'ja' ? 'をお気に入りから解除しました' : 'removed from favorites'}`
          : `@${username} ${language === 'ja' ? 'をお気に入りに登録・固定しました ★' : 'pinned to favorites ★'}`
      );
      return next;
    });
  };

  // Sync dark class on document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  // Toggle language
  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'ja' ? 'en' : 'ja';
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Save item to search history
  const recordToHistory = useCallback((userStats: UserStatsResponse) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.username.toLowerCase() !== userStats.user.username.toLowerCase()
      );
      const newItem: SearchHistoryItem = {
        username: userStats.user.username,
        name: userStats.user.name || userStats.user.username,
        picture: userStats.user.picture,
        totalXp: userStats.user.totalXp,
        streak: userStats.user.streak,
        timestamp: Date.now(),
      };
      const updated = [newItem, ...filtered].slice(0, 9);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save to localStorage', err);
      }
      return updated;
    });
  }, []);

  const handleRemoveHistoryItem = (username: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter(
        (item) => item.username.toLowerCase() !== username.toLowerCase()
      );
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
    showToast(`@${username} ${language === 'ja' ? 'を履歴から削除しました' : 'removed from history'}`);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (err) {
      console.warn(err);
    }
    showToast(language === 'ja' ? '検索履歴をすべてクリアしました' : 'Search history cleared');
  };

  // Fetch or select User
  const handleSearchUser = async (username: string, forceRefresh = false) => {
    if (!username.trim()) return;

    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingUser(true);
      setUserError(null);
    }

    try {
      const url = `/api/user/${encodeURIComponent(username.trim())}${forceRefresh ? '?force=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setUserError(data.error || (language === 'ja' ? 'ユーザーの取得に失敗しました。' : 'Failed to retrieve user profile.'));
        return;
      }

      setCurrentStats(data);
      recordToHistory(data);
      setActivePage('profile');
      setUserError(null);

      if (forceRefresh) {
        showToast(language === 'ja' ? '最新データを照合し、スナップショットを記録しました' : 'Profile synced and snapshot recorded');
      } else if (data.isReal) {
        showToast(language === 'ja' ? `公開データを正常に読み込みました (${data.user.name || data.user.username})` : `Successfully loaded profile (${data.user.name || data.user.username})`);
      }
    } catch (err: any) {
      setUserError(language === 'ja' ? 'ネットワーク通信エラーが発生しました。接続をご確認ください。' : 'Network error. Please check connection.');
    } finally {
      setIsLoadingUser(false);
      setIsRefreshing(false);
    }
  };

  // Save manual study log
  const handleSaveStudyLog = async (xp: number, streak: number, langCode: string) => {
    const targetUsername = currentStats?.user.username || 'my_duo_user';
    try {
      const res = await fetch(`/api/user/${encodeURIComponent(targetUsername)}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xp,
          streak,
          language: langCode,
          displayName: currentStats?.user.name,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || (language === 'ja' ? '学習ログの保存に失敗しました。' : 'Failed to save study log.'));
      }

      const updatedData: UserStatsResponse = await res.json();
      setCurrentStats(updatedData);
      recordToHistory(updatedData);
      setActivePage('profile');
      showToast(`+${xp} XP ${language === 'ja' ? 'を安全に記録しました！' : 'safely recorded!'}`);
    } catch (err: any) {
      showToast(err.message || (language === 'ja' ? '学習ログの保存に失敗しました' : 'Error saving log'));
      throw err;
    }
  };

  // Initial mount: check URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('u');
    const pageParam = params.get('p') as ActiveNavPage | null;

    if (userParam) {
      handleSearchUser(userParam);
    } else if (pageParam && ['home', 'goals', 'about'].includes(pageParam)) {
      setActivePage(pageParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0b0c10] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-purple-900/40 selection:text-purple-200 transition-colors duration-250">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-900 dark:bg-[#1a1c27] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUsername={currentStats?.user.username}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* HOME PAGE */}
        {activePage === 'home' && (
          <div className="space-y-12">
            {/* Hero Section with Video-Inspired Text Reel */}
            <div className="text-center max-w-4xl mx-auto pt-2 sm:pt-6">
              {/* Focus Target: H1 Headline matching the video exactly */}
              <TextReelHeadline language={language} isDarkMode={isDarkMode} />

              {/* Minimal Search Form */}
              <div className="mt-12 max-w-xl mx-auto text-left">
                <UserSearchForm
                  onSearch={(username) => handleSearchUser(username)}
                  isLoading={isLoadingUser}
                  language={language}
                  history={searchHistoryWithFavorites}
                />

                {userError && (
                  <div className="mt-4 p-4 bg-red-50/80 dark:bg-red-950/40 rounded-2xl border border-red-200/80 dark:border-red-800/60 text-xs text-red-800 dark:text-red-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{userError}</p>
                      <p className="mt-0.5 text-red-600 dark:text-red-400">{t.searchErrorNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prominent Search History Section */}
            <SearchHistoryList
              history={searchHistoryWithFavorites}
              onSelectUser={(username) => handleSearchUser(username)}
              onRemoveItem={handleRemoveHistoryItem}
              onClearHistory={handleClearHistory}
              onToggleFavorite={handleToggleFavorite}
              language={language}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 transition-all duration-200 ease-out transform-gpu hover:scale-[1.025] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-8px_rgba(16,185,129,0.16)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)] hover:border-emerald-300 dark:hover:border-emerald-700/80 cursor-default group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{t.feature1Title}</h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.feature1Desc}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 transition-all duration-200 ease-out transform-gpu hover:scale-[1.025] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-8px_rgba(16,185,129,0.16)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)] hover:border-emerald-300 dark:hover:border-emerald-700/80 cursor-default group">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200">
                  <Zap className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{t.feature2Title}</h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.feature2Desc}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 transition-all duration-200 ease-out transform-gpu hover:scale-[1.025] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-8px_rgba(16,185,129,0.16)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)] hover:border-emerald-300 dark:hover:border-emerald-700/80 cursor-default group">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
                  <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{t.feature3Title}</h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE & STATS PAGE */}
        {activePage === 'profile' && currentStats && (
          <div className="space-y-6">
            <UserProfileHeader
              stats={currentStats}
              onRefresh={() => handleSearchUser(currentStats.user.username, true)}
              isRefreshing={isRefreshing}
              onOpenQuickLog={() => setIsQuickLogOpen(true)}
              isFavorite={favorites.includes(currentStats.user.username.toLowerCase())}
              onToggleFavorite={handleToggleFavorite}
              onOpenCompare={(uname) => {
                setCompareUser1(uname);
                setActivePage('compare');
              }}
              language={language}
            />

            {/* Profile Navigation Sub-tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setProfileTab('stats')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  profileTab === 'stats'
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>{t.tabStats}</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileTab('languages')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  profileTab === 'languages'
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t.tabLanguages} ({currentStats.user.courses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileTab('snapshots')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  profileTab === 'snapshots'
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.tabSnapshots} ({currentStats.snapshots.length})</span>
              </button>
            </div>

            {/* Tab Panels */}
            {profileTab === 'stats' && <StatsView stats={currentStats} language={language} />}
            {profileTab === 'languages' && <LanguageBreakdownView courses={currentStats.user.courses} language={language} />}
            {profileTab === 'snapshots' && (
              <SnapshotHistoryView
                snapshots={currentStats.snapshots}
                firstTrackedAt={currentStats.firstTrackedAt}
                lastUpdatedAt={currentStats.lastUpdatedAt}
                language={language}
              />
            )}
          </div>
        )}

        {/* RIVAL COMPARISON (VS) PAGE */}
        {activePage === 'compare' && (
          <CompareView
            initialUser1={compareUser1 || currentStats?.user.username || 'tanaka_learning'}
            initialUser2={compareUser2 || (currentStats?.user.username === 'luis' ? 'sakura_polyglot' : 'luis')}
            history={searchHistoryWithFavorites}
            favorites={favorites}
            onSelectProfile={(username) => handleSearchUser(username)}
            language={language}
          />
        )}

        {/* GOALS & INSIGHTS PAGE */}
        {activePage === 'goals' && (
          <GoalsAndInsightsView
            stats={currentStats}
            onNavigateToSearch={() => setActivePage('home')}
            language={language}
          />
        )}

        {/* ABOUT & POLICY PAGE */}
        {activePage === 'about' && <AboutView language={language} />}
      </main>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        username={currentStats?.user.username || 'my_duo_user'}
        currentStreak={currentStats?.user.streak || 0}
        onSaveLog={handleSaveStudyLog}
        language={language}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />
    </div>
  );
}
