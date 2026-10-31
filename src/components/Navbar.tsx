import { BarChart3, Target, Info, Search, Menu, X, Sun, Moon, Languages, Swords } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo.tsx';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

export type ActiveNavPage = 'home' | 'profile' | 'compare' | 'goals' | 'about';

interface NavbarProps {
  activePage: ActiveNavPage;
  onNavigate: (page: ActiveNavPage) => void;
  currentUsername?: string;
  language: Language;
  onToggleLanguage: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({
  activePage,
  onNavigate,
  currentUsername,
  language,
  onToggleLanguage,
  isDarkMode,
  onToggleDarkMode,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleNav = (page: ActiveNavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => handleNav('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-85 cursor-pointer"
          aria-label="ホームへ戻る"
        >
          <Logo size="md" subtitle={t.appSubtitle} />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'home'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.navSearch}</span>
            </button>

            {currentUsername && (
              <button
                onClick={() => handleNav('profile')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activePage === 'profile'
                    ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{currentUsername}{t.userStatsTitleSuffix}</span>
              </button>
            )}

            <button
              onClick={() => handleNav('compare')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'compare'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{t.navCompare}</span>
            </button>

            <button
              onClick={() => handleNav('goals')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'goals'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{t.navGoals}</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'about'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t.navAbout}</span>
            </button>
          </nav>

          {/* Vertical Divider */}
          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Language Toggle (JA / EN) */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700"
            title="言語切り替え / Switch Language"
            aria-label="言語切り替え"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono uppercase">{language === 'ja' ? 'EN' : '日本語'}</span>
          </button>

          {/* Dark Mode Toggle (☀️ / 🌙) */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
            title={isDarkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
            aria-label="ダークモード切り替え"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Button */}
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center gap-1"
          >
            <span className="font-mono">{language.toUpperCase()}</span>
          </button>

          {/* Mobile Dark Mode Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700"
            aria-label="ダークモード切り替え"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="メニューを開く"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-md">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              activePage === 'home'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>{t.navSearch}</span>
          </button>

          {currentUsername && (
            <button
              onClick={() => handleNav('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                activePage === 'profile'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>{currentUsername}{t.userStatsTitleSuffix}</span>
            </button>
          )}

          <button
            onClick={() => handleNav('compare')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              activePage === 'compare'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Swords className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{t.navCompare}</span>
          </button>

          <button
            onClick={() => handleNav('goals')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              activePage === 'goals'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{t.navGoals}</span>
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              activePage === 'about'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4 text-slate-500" />
            <span>{t.navAbout}</span>
          </button>
        </div>
      )}
    </header>
  );
}
