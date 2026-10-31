import React, { useState } from 'react';
import { X, PlusCircle, Flame, Globe, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LANGUAGE_MAP } from '../utils/stats.ts';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  currentStreak: number;
  onSaveLog: (xp: number, streak: number, language: string) => Promise<void>;
  language: Language;
}

export default function QuickLogModal({
  isOpen,
  onClose,
  username,
  currentStreak,
  onSaveLog,
  language,
}: QuickLogModalProps) {
  const [xpInput, setXpInput] = useState<string>('50');
  const [streakInput, setStreakInput] = useState<number>(currentStreak > 0 ? currentStreak + 1 : 1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const presetXpList = [30, 50, 100, 150, 200];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const xpVal = parseInt(xpInput, 10);
    if (isNaN(xpVal) || xpVal <= 0) return;

    setIsSubmitting(true);
    try {
      await onSaveLog(xpVal, streakInput, selectedLanguage);
      setSuccessMessage(`+${xpVal} ${t.modalSuccess}`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-log-title"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.modalComplianceBadge}</span>
            </div>
            <h2 id="quick-log-title" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {t.modalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{username} {t.modalSubtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* XP Input & Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.modalXpLabel}
              </label>
              <div className="flex items-center gap-2 mb-2.5">
                {presetXpList.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setXpInput(String(preset))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      xpInput === String(preset)
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    +{preset}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={xpInput}
                  onChange={(e) => setXpInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                  required
                />
                <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">XP</span>
              </div>
            </div>

            {/* Streak & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{t.modalStreakLabel}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={streakInput}
                    onChange={(e) => setStreakInput(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                  />
                  <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                    {language === 'ja' ? '日' : 'days'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{t.modalLangLabel}</span>
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 bg-white dark:bg-slate-900"
                >
                  {Object.entries(LANGUAGE_MAP).map(([code, info]) => (
                    <option key={code} value={code}>
                      {info.flag} {info.name} ({code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmitting ? t.modalSubmitting : t.modalSubmit}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
