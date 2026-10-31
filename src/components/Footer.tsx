import Logo from './Logo.tsx';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

interface FooterProps {
  onNavigate: (page: 'home' | 'goals' | 'about') => void;
  language: Language;
}

export default function Footer({ onNavigate, language }: FooterProps) {
  const t = TRANSLATIONS[language];

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Logo size="sm" subtitle={t.appSubtitle} />
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-left max-w-sm">
            {language === 'ja'
              ? 'Duolingo学習者のためのオープン統計・目標管理・進捗可視化ファンサイト'
              : 'Open learning stats, goal tracking, and progress visualization for Duolingo learners'}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {t.navSearch}
          </button>
          <button
            onClick={() => onNavigate('goals')}
            className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {t.navGoals}
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {t.navAbout}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 gap-3">
        <p className="text-center sm:text-left max-w-2xl leading-relaxed">
          © 2026 DuoStats. {t.unofficialDisclaimer}
        </p>
        <p className="shrink-0 font-mono text-[10px]">{language === 'ja' ? '利用規約完全配慮設計 · 完全無料運用' : 'ToS Compliant Design · 100% Free'}</p>
      </div>
    </footer>
  );
}
