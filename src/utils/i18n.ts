export type Language = 'ja' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  navSearch: string;
  navCompare: string;
  navGoals: string;
  navAbout: string;
  heroBadge: string;
  heroReelPrefix: string;
  heroReelWords: string[];
  heroReelHint: string;
  heroDescription: string;
  searchPlaceholder: string;
  searchSubmitBtn: string;
  searchLoading: string;
  searchRequired: string;
  searchErrorNote: string;
  searchComplianceBadge: string;
  unofficialDisclaimer: string;
  manualLogCta: string;
  recentSearchesTitle: string;
  clearHistory: string;
  noHistoryTitle: string;
  noHistoryDesc: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  userStatsTitleSuffix: string;
  modalTitle: string;
  modalSubtitle: string;
  modalComplianceBadge: string;
  modalXpLabel: string;
  modalStreakLabel: string;
  modalLangLabel: string;
  modalSubmit: string;
  modalSubmitting: string;
  modalSuccess: string;
  metricTotalXp: string;
  metricTotalXpDesc: string;
  metricStreak: string;
  metricStreakDesc: string;
  metricWeeklyXp: string;
  metricWeeklyXpDesc: string;
  metricCoursesCount: string;
  metricCoursesDesc: string;
  tabStats: string;
  tabLanguages: string;
  tabSnapshots: string;
  optOutTitle: string;
  optOutDesc: string;
  optOutPlaceholder: string;
  optOutBtn: string;
  optOutProcessing: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  faqTitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  suggestionsTitle: string;
  favoriteBadge: string;
  addToFavorites: string;
  removeFromFavorites: string;
  pinnedBadge: string;
  compareTitle: string;
  compareSubtitle: string;
  user1Placeholder: string;
  user2Placeholder: string;
  compareBtn: string;
  compareWin: string;
  compareTie: string;
  compareSharedCourses: string;
  compareTotalXpWin: string;
  compareStreakWin: string;
  compareWeeklyWin: string;
  compareVsBadge: string;
  radarChartTitle: string;
  radarChartDesc: string;
  radarViewToggle: string;
  barViewToggle: string;
  heatmapTitle: string;
  heatmapSubtitle: string;
  heatmapLegendLess: string;
  heatmapLegendMore: string;
  heatmapActiveDays: string;
  heatmapDailyAvg: string;
  heatmapMaxDay: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ja: {
    appTitle: 'DuoStats',
    appSubtitle: '非公式 学習統計ファンサイト',
    navSearch: 'ユーザー検索',
    navCompare: 'ライバル比較 (VS)',
    navGoals: '学習目標・インサイト',
    navAbout: 'サイト情報・規約ポリシー',
    heroBadge: '利用規約に配慮した安全な非公式Duolingo学習統計',
    heroReelPrefix: 'we make',
    heroReelWords: ['cursors', 'buttons', 'sidebars', 'shaders', 'loaders', 'toggles'],
    heroReelHint: 'Scroll or click reel to roll to the next word',
    heroDescription:
      'ユーザー名で検索して統計を確認したり、手動で日々の学習ログを安全に記録。総XP、連続ストリーク、学習言語別の内訳、目標達成度をクリーンな北欧モダンデザインでお届けします。',
    searchPlaceholder: 'Duolingoユーザー名を入力 (例: luis)',
    searchSubmitBtn: '統計ダッシュボードを表示',
    searchLoading: 'データ取得中...',
    searchRequired: 'Duolingoのユーザー名を入力してください',
    searchErrorNote: '※ スペルや非公開設定をご確認ください。「手動で学習記録をつける」から直接記録を始めることも可能です。',
    searchComplianceBadge: '🔒 パスワード不要 · 公開情報のみオンデマンド照合 · 規約準拠設計',
    unofficialDisclaimer:
      '※ 当サイト「DuoStats」は個人が運営する非公式ファンプロジェクトです。Duolingo, Inc. との提携、公認、承認関係はありません。「Duolingo」は Duolingo, Inc. の登録商標です。',
    manualLogCta: '手動で本日の学習を記録する (安全モード)',
    recentSearchesTitle: '最近検索したユーザー',
    clearHistory: '履歴をクリア',
    noHistoryTitle: '検索履歴はまだありません',
    noHistoryDesc: '上部の入力欄からDuolingoユーザー名を検索すると、次回すぐにアクセスできるよう自動的にここに保存されます。',
    feature1Title: '利用規約に配慮した設計',
    feature1Desc: '不正な巡回ボットや過度なスクレイピングを行わず、安全なオンデマンド照合と手動記録を両立しています。',
    feature2Title: 'スナップショット差分計測',
    feature2Desc: '記録時点ごとの総XP差分から、日別・週別の獲得XP推移を正確に算出してグラフ表示します。',
    feature3Title: '学習目標＆マイルストーン予測',
    feature3Desc: '週間XP目標の達成率プログレスバーや、次のストリーク大台達成予定日を自動予測します。',
    userStatsTitleSuffix: 'の統計',
    modalTitle: '本日の学習ログを記録',
    modalSubtitle: 'の学習記録に獲得XPとストリークを手動で反映します。',
    modalComplianceBadge: '利用規約完全準拠 · 安全学習トラッカー',
    modalXpLabel: '本日獲得した XP',
    modalStreakLabel: '本日の連続学習日数',
    modalLangLabel: '学習言語',
    modalSubmit: '学習ログを記録して統計を更新',
    modalSubmitting: '保存中...',
    modalSuccess: 'XP を学習記録に安全保存しました！',
    metricTotalXp: '総獲得 XP',
    metricTotalXpDesc: '全コース累計の経験値',
    metricStreak: '連続学習日数',
    metricStreakDesc: '継続ストリーク記録',
    metricWeeklyXp: '週間獲得 XP (計測差分)',
    metricWeeklyXpDesc: '過去7日間の計測差分',
    metricCoursesCount: '学習中言語数',
    metricCoursesDesc: '登録学習言語',
    tabStats: 'XP推移統計',
    tabLanguages: '学習言語別統計',
    tabSnapshots: 'スナップショット履歴',
    optOutTitle: '登録除外・データ削除申請（オプトアウト）',
    optOutDesc: 'DuoStatsの検索結果や履歴からご自身のアカウントやスナップショット履歴を削除したい場合は、以下のフォームからユーザー名を入力して申請してください。即座にサーバーから完全削除されます。',
    optOutPlaceholder: '削除したいユーザー名 (例: my_username)',
    optOutBtn: 'データを即時削除',
    optOutProcessing: '削除処理中...',
    disclaimerTitle: '免責事項（Disclaimer）',
    disclaimerBody: 'DuoStatsはDuolingo, Inc.とは一切関係のない、独立したファンメイドの非公式学習支援プロジェクトです。「Duolingo」およびDuolingoのロゴ、キャラクター、商標はDuolingo, Inc.の登録商標または商標です。本サイトのデザイン・エンブレムはすべて独自のオリジナルであり、公式アセットの無断複製・商業的流用は行っておりません。',
    faqTitle: 'よくある質問（FAQ）',
    faq1Q: 'Q. Duolingoの規約に違反しませんか？',
    faq1A: 'DuoStatsではアカウントのパスワードやCookieを求めず、ユーザー主導の手動学習記録モードを設けています。また、Duolingoサーバーへ負荷をかける定期ボット巡回を行わないため、安全にご利用いただけます。',
    faq2Q: 'Q. 手動で学習ログを追加するにはどうすればよいですか？',
    faq2A: 'ご自身のユーザー名でプロフィール画面を開き、「本日の学習を記録 (+XP)」ボタンから本日獲得したXPやストリークを入力すると、即座に推移グラフやランキングへ安全に反映されます。',
    faq3Q: 'Q. ランキングや検索から自分のユーザー名を消したいです。',
    faq3A: '本ページ内の「登録除外・データ削除申請（オプトアウト）」フォームにご自身のユーザー名を入力して送信してください。サーバーから履歴が即時削除され、以降の検索からも除外されます。',
    suggestionsTitle: '候補 & 履歴',
    favoriteBadge: 'お気に入り',
    addToFavorites: 'お気に入り登録',
    removeFromFavorites: 'お気に入り解除',
    pinnedBadge: 'ピン留め中',
    compareTitle: 'ライバル比較（VS 対戦モード）',
    compareSubtitle: '2人のDuolingo学習者を並べて、連続記録や獲得XP、学習言語を徹底比較！',
    user1Placeholder: '1人目のユーザー名 (例: luis)',
    user2Placeholder: '2人目のユーザー名 (例: tanaka_learning)',
    compareBtn: 'VS 比較を実行する',
    compareWin: 'リード中',
    compareTie: '同点',
    compareSharedCourses: '共通して学んでいる言語',
    compareTotalXpWin: '総XPリーダー',
    compareStreakWin: 'ストリーク継続リーダー',
    compareWeeklyWin: '週間ペースリーダー',
    compareVsBadge: 'VS BATTLE',
    radarChartTitle: '言語スキル・レーダーチャート',
    radarChartDesc: '学習中言語の獲得XPとクラウン習熟度のバランスを多角形で分析',
    radarViewToggle: 'レーダーチャート',
    barViewToggle: 'バーチャート',
    heatmapTitle: '学習アクティビティ・ヒートマップ（草グラフ）',
    heatmapSubtitle: '過去のXP獲得ペースと継続ストリークの年間記録',
    heatmapLegendLess: '少',
    heatmapLegendMore: '多',
    heatmapActiveDays: 'アクティブ学習日数',
    heatmapDailyAvg: '1日平均獲得XP',
    heatmapMaxDay: '1日の最高獲得XP',
  },
  en: {
    appTitle: 'DuoStats',
    appSubtitle: 'Unofficial Learning Stats Fan Site',
    navSearch: 'Search User',
    navCompare: 'Compare (VS)',
    navGoals: 'Goals & Insights',
    navAbout: 'About & Policies',
    heroBadge: 'ToS-Compliant & Safe Unofficial Duolingo Stats',
    heroReelPrefix: 'we make',
    heroReelWords: ['cursors', 'buttons', 'sidebars', 'shaders', 'loaders', 'toggles'],
    heroReelHint: 'Scroll or click reel to roll to the next word',
    heroDescription:
      'Search usernames to inspect metrics or safely record your daily learning logs. Track total XP, streaks, language distributions, and goals in a clean Nordic modern interface.',
    searchPlaceholder: 'Enter Duolingo username (e.g. luis)',
    searchSubmitBtn: 'View Stats Dashboard',
    searchLoading: 'Fetching data...',
    searchRequired: 'Please enter a Duolingo username',
    searchErrorNote: 'Note: Check spelling or private account settings. You can also start tracking directly with manual safe mode.',
    searchComplianceBadge: '🔒 Zero passwords · On-demand public verification · ToS compliant',
    unofficialDisclaimer:
      '※ DuoStats is an independent unofficial fan project. Not affiliated with, endorsed, or sponsored by Duolingo, Inc. "Duolingo" is a registered trademark of Duolingo, Inc.',
    manualLogCta: 'Log Today’s Session Manually (Safe Mode)',
    recentSearchesTitle: 'Recent Searches',
    clearHistory: 'Clear History',
    noHistoryTitle: 'No search history yet',
    noHistoryDesc: 'Search for any Duolingo user above, and they will be saved here automatically for quick one-click access.',
    feature1Title: 'ToS-Compliant Architecture',
    feature1Desc: 'Zero scraping bots or continuous crawlers. Combines on-demand single read with self-managed safe logs.',
    feature2Title: 'Delta Snapshot Tracking',
    feature2Desc: 'Calculates weekly gain and historical trends purely from recorded total XP snapshot differences.',
    feature3Title: 'Goals & Milestone Forecasts',
    feature3Desc: 'Visualizes weekly XP goal progress bars and automatically forecasts your next streak milestone date.',
    userStatsTitleSuffix: '’s Stats',
    modalTitle: 'Log Today’s Study Session',
    modalSubtitle: 'Manually record earned XP and streaks for @',
    modalComplianceBadge: '100% ToS Compliant · Safe Tracker',
    modalXpLabel: 'XP Earned Today',
    modalStreakLabel: 'Current Streak Days',
    modalLangLabel: 'Learning Language',
    modalSubmit: 'Save Log & Update Stats',
    modalSubmitting: 'Saving...',
    modalSuccess: 'XP safely saved to your learning log!',
    metricTotalXp: 'Total XP',
    metricTotalXpDesc: 'Cumulative lifetime XP',
    metricStreak: 'Streak Days',
    metricStreakDesc: 'Continuous learning record',
    metricWeeklyXp: 'Weekly XP (Snapshot Delta)',
    metricWeeklyXpDesc: 'Measured gain over past 7 days',
    metricCoursesCount: 'Languages Studied',
    metricCoursesDesc: 'Registered courses',
    tabStats: 'XP Growth Trends',
    tabLanguages: 'Language Breakdown',
    tabSnapshots: 'Snapshot History',
    optOutTitle: 'Opt-Out & Instant Data Deletion',
    optOutDesc: 'If you wish to remove your username and snapshot history from DuoStats, enter your username below to delete it permanently from our server immediately.',
    optOutPlaceholder: 'Username to delete (e.g. my_username)',
    optOutBtn: 'Delete Data Immediately',
    optOutProcessing: 'Deleting...',
    disclaimerTitle: 'Disclaimer',
    disclaimerBody: 'DuoStats is an independent fan project not affiliated with, endorsed by, or sponsored by Duolingo, Inc. Duolingo and related marks are registered trademarks of Duolingo, Inc. All emblems and custom UI designs are original works.',
    faqTitle: 'Frequently Asked Questions (FAQ)',
    faq1Q: 'Q. Does this violate Duolingo’s Terms of Service?',
    faq1A: 'No. DuoStats does not collect passwords or session cookies, and features a user-driven manual log mode without background crawler bots that stress servers.',
    faq2Q: 'Q. How do I manually add a study log?',
    faq2A: 'Open your profile view and click "Log Today’s Session (+XP)" to enter the XP earned today. It will be reflected immediately in your charts.',
    faq3Q: 'Q. How do I delete my data from DuoStats?',
    faq3A: 'Use the Opt-Out form on this page to enter your username. All associated logs and snapshots will be wiped from the server instantly.',
    suggestionsTitle: 'Suggestions & History',
    favoriteBadge: 'Favorite',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove Favorite',
    pinnedBadge: 'Pinned',
    compareTitle: 'Rival Comparison (VS Battle)',
    compareSubtitle: 'Compare two Duolingo learners head-to-head on streak, total XP, and language journeys!',
    user1Placeholder: 'First username (e.g. luis)',
    user2Placeholder: 'Second username (e.g. tanaka_learning)',
    compareBtn: 'Compare Learners (VS)',
    compareWin: 'Leading',
    compareTie: 'Tied',
    compareSharedCourses: 'Shared Learning Languages',
    compareTotalXpWin: 'Total XP Leader',
    compareStreakWin: 'Streak Leader',
    compareWeeklyWin: 'Weekly Gain Leader',
    compareVsBadge: 'VS BATTLE',
    radarChartTitle: 'Polyglot Skill Radar',
    radarChartDesc: 'Multi-language balance analyzing XP distribution and crowns mastery',
    radarViewToggle: 'Radar View',
    barViewToggle: 'Bar View',
    heatmapTitle: 'Learning Activity Heatmap (GitHub Style)',
    heatmapSubtitle: 'Daily study XP gains and streak consistency over the past months',
    heatmapLegendLess: 'Less',
    heatmapLegendMore: 'More',
    heatmapActiveDays: 'Active Study Days',
    heatmapDailyAvg: 'Daily Avg XP',
    heatmapMaxDay: 'Highest Daily XP',
  },
};
