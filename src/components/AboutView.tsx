import React, { useState } from 'react';
import { ShieldCheck, Lock, DollarSign, Database, AlertCircle, HelpCircle, UserX, CheckCircle2 } from 'lucide-react';
import Logo from './Logo.tsx';
import { Language, TRANSLATIONS } from '../utils/i18n.ts';

interface AboutViewProps {
  language: Language;
}

export default function AboutView({ language }: AboutViewProps) {
  const [optOutUsername, setOptOutUsername] = useState('');
  const [optOutStatus, setOptOutStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = TRANSLATIONS[language];

  const handleOptOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optOutUsername.trim()) return;

    setIsSubmitting(true);
    setOptOutStatus({ type: null, message: '' });

    try {
      const res = await fetch(`/api/user/${encodeURIComponent(optOutUsername.trim())}/optout`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setOptOutStatus({
          type: 'success',
          message: data.message || (language === 'ja' ? 'ユーザーデータを正常に削除・除外しました。' : 'User data deleted successfully.'),
        });
        setOptOutUsername('');
      } else {
        setOptOutStatus({
          type: 'error',
          message: data.error || (language === 'ja' ? '削除処理に失敗しました。' : 'Failed to delete data.'),
        });
      }
    } catch (err: any) {
      setOptOutStatus({
        type: 'error',
        message: language === 'ja' ? 'ネットワーク通信エラーが発生しました。' : 'Network error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="lg" subtitle={t.appSubtitle} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'ja' ? 'DuoStats（デュオスタッツ）について' : 'About DuoStats'}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'ja' ? (
            <>
              DuoStatsは、外国語学習アプリ「Duolingo」で日々の学習に励むユーザーのために開発された
              <strong>非公式のオープン学習統計・記録Webサイト</strong>です。
              Duolingoの利用規約（ボットや過度な自動アクセスの制限）に配慮し、手動記録モードとユーザー同意に基づく安全な公開データ照合を組み合わせて運用されています。
            </>
          ) : (
            <>
              DuoStats is an independent, unofficial language analytics web app built for Duolingo learners.
              Designed with strict adherence to Terms of Service, it provides manual progress tracking alongside lightweight, on-demand public verification without high-frequency crawling bots.
            </>
          )}
        </p>
      </div>

      {/* Compliance & Security Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{t.feature1Title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.feature1Desc}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {language === 'ja' ? 'パスワード・Cookie不要' : 'Zero Passwords or Cookies'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'ja'
              ? 'ユーザーのパスワードやセッションCookie、非公開の個人情報は一切要求・保存しません。インターネット上に一般公開されているプロフィール情報のみを対象としています。'
              : 'DuoStats never requires passwords, session cookies, or private credentials. It reads only publicly viewable profile summaries.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
            <Database className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{t.feature2Title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.feature2Desc}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {language === 'ja' ? '完全無料での持続可能な運用' : '100% Free Forever'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'ja'
              ? '外部の有料APIサービスや課金データベースを一切使用せず、無料枠とサーバー内ストレージで完結。広告や有料サブスクリプションなしで無料でご利用いただけます。'
              : 'Built without expensive cloud APIs, operating on lightweight storage. Free to use with no advertisements or subscriptions.'}
          </p>
        </div>
      </div>

      {/* Opt-out / Account Deletion Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <UserX className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {t.optOutTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.optOutDesc}
        </p>

        <form onSubmit={handleOptOut} className="pt-2 max-w-lg space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="text"
              value={optOutUsername}
              onChange={(e) => setOptOutUsername(e.target.value)}
              placeholder={t.optOutPlaceholder}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-red-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? t.optOutProcessing : t.optOutBtn}
            </button>
          </div>

          {optOutStatus.type === 'success' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{optOutStatus.message}</span>
            </div>
          )}

          {optOutStatus.type === 'error' && (
            <div className="p-3 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span>{optOutStatus.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{t.disclaimerTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.disclaimerBody}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-700 space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>{t.faqTitle}</span>
        </h2>

        <div className="space-y-3 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{t.faq1Q}</h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.faq1A}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{t.faq2Q}</h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.faq2A}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{t.faq3Q}</h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.faq3A}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
