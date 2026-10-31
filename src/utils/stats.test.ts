import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatNumber,
  formatStreak,
  getLanguageInfo,
  calculateWeeklyXp,
  aggregateLanguageStats,
  generateDemoSnapshots,
  formatChartData,
  calculateMilestones,
  calculateAchievementBadges,
} from './stats.ts';

test('formatNumber formats digits with comma', () => {
  assert.equal(formatNumber(0), '0');
  assert.equal(formatNumber(1234), '1,234');
  assert.equal(formatNumber(394528), '394,528');
  assert.equal(formatNumber(null), '0');
});

test('formatStreak appends day suffix and handles zero', () => {
  assert.equal(formatStreak(0), '0日');
  assert.equal(formatStreak(42), '42日');
  assert.equal(formatStreak(3986), '3,986日');
});

test('getLanguageInfo identifies known language flags and names', () => {
  const en = getLanguageInfo('en');
  assert.equal(en.name, '英語');
  assert.equal(en.flag, '🇺🇸');

  const es = getLanguageInfo('es');
  assert.equal(es.name, 'スペイン語');
  assert.equal(es.flag, '🇪🇸');

  const ja = getLanguageInfo('ja');
  assert.equal(ja.name, '日本語');
  assert.equal(ja.flag, '🇯🇵');

  const unknown = getLanguageInfo('xyz');
  assert.equal(unknown.flag, '🌐');
});

test('calculateWeeklyXp accurately measures delta over snapshots', () => {
  // Case 1: Empty or 1 snapshot
  assert.deepEqual(calculateWeeklyXp([]), { weeklyXp: 0, isMeasured: false, daysSpan: 0 });

  const oneSnap = [{ timestamp: 1000000, dateStr: '2026-10-20', totalXp: 5000, streak: 10 }];
  assert.deepEqual(calculateWeeklyXp(oneSnap), { weeklyXp: 0, isMeasured: false, daysSpan: 0 });

  // Case 2: Multi snapshots within 7 days
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const multiSnap = [
    { timestamp: now - 7 * dayMs, dateStr: '2026-10-20', totalXp: 10000, streak: 50 },
    { timestamp: now - 3 * dayMs, dateStr: '2026-10-24', totalXp: 10400, streak: 54 },
    { timestamp: now, dateStr: '2026-10-27', totalXp: 11050, streak: 57 },
  ];

  const result = calculateWeeklyXp(multiSnap);
  assert.equal(result.isMeasured, true);
  assert.equal(result.weeklyXp, 1050); // 11050 - 10000
});

test('aggregateLanguageStats orders courses by XP and computes share', () => {
  const courses = [
    { id: '1', title: 'Japanese', learningLanguage: 'ja', fromLanguage: 'en', xp: 500, crowns: 10 },
    { id: '2', title: 'Spanish', learningLanguage: 'es', fromLanguage: 'en', xp: 1500, crowns: 30 },
  ];

  const aggregated = aggregateLanguageStats(courses);
  assert.equal(aggregated.length, 2);
  assert.equal(aggregated[0].learningLanguage, 'es'); // highest XP first
  assert.equal(aggregated[0].percentage, 75); // 1500 / 2000 = 75%
  assert.equal(aggregated[1].learningLanguage, 'ja');
  assert.equal(aggregated[1].percentage, 25); // 500 / 2000 = 25%
});

test('generateDemoSnapshots produces requested number of daily items', () => {
  const demoSnaps = generateDemoSnapshots(50000, 100, 7);
  assert.equal(demoSnaps.length, 8); // 7 to 0 inclusive
  assert.ok(demoSnaps[demoSnaps.length - 1].totalXp >= demoSnaps[0].totalXp);
});

test('formatChartData builds chart coordinates', () => {
  const now = Date.now();
  const snaps = [
    { timestamp: now - 86400000, dateStr: '2026-10-26', totalXp: 1000, streak: 1 },
    { timestamp: now, dateStr: '2026-10-27', totalXp: 1250, streak: 2 },
  ];

  const chart = formatChartData(snaps, '7d');
  assert.equal(chart.length, 2);
  assert.equal(chart[0].totalXp, 1000);
  assert.equal(chart[1].totalXp, 1250);
  assert.equal(chart[1].dailyGain, 250);
});

test('calculateMilestones calculates streak and XP milestones', () => {
  const m = calculateMilestones(42, 12500);
  assert.equal(m.currentStreak, 42);
  assert.equal(m.nextStreakTarget, 50);
  assert.equal(m.streakDaysRemaining, 8); // 50 - 42
  assert.equal(m.nextXpTarget, 25000);
  assert.equal(m.xpRemaining, 12500); // 25000 - 12500
});

test('calculateAchievementBadges evaluates unlock states correctly', () => {
  const badges = calculateAchievementBadges(15000, 35, 2);
  const firstStep = badges.find((b) => b.id === 'first-step');
  const monthStreak = badges.find((b) => b.id === 'month-streak');
  const century = badges.find((b) => b.id === 'century-streak');

  assert.equal(firstStep?.isUnlocked, true);
  assert.equal(monthStreak?.isUnlocked, true);
  assert.equal(century?.isUnlocked, false);
});

