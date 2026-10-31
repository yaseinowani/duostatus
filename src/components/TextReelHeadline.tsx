import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, useMotionValue } from 'framer-motion';
import { Language } from '../utils/i18n.ts';

export const STATS_ITEMS_JA = [
  '学習成果',
  'ストリーク',
  '獲得XP',
  '語学の習慣',
  'マイルストーン',
  '継続記録',
];

export const STATS_ITEMS_EN = [
  'streaks',
  'earned XP',
  'learning habits',
  'milestones',
  'course stats',
  'momentum',
];

export interface KineticReelTextProps {
  prefix?: string;
  items?: string[];
  interval?: number;
  className?: string;
  theme?: 'dark' | 'light';
  autoPlay?: boolean;
  onSelect?: ((item: string) => void) | null;
}

/**
 * KineticReelText
 * Centered 3D mechanical cylinder reel harmonized with DuoStats brand aesthetic
 */
export function KineticReelText({
  prefix = 'we track',
  items = STATS_ITEMS_EN,
  interval = 2200,
  className = '',
  theme = 'dark',
  autoPlay = true,
  onSelect = null,
}: KineticReelTextProps) {
  const numItems = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const drumIndex = useMotionValue(0);
  const smoothDrum = useSpring(drumIndex, {
    stiffness: 240,
    damping: 26,
    mass: 0.75,
  });

  const [displayPos, setDisplayPos] = useState(0);

  useEffect(() => {
    return smoothDrum.on('change', (latest) => {
      setDisplayPos(latest);
      const normalized = ((Math.round(latest) % numItems) + numItems) % numItems;
      if (normalized !== activeIndex) {
        setActiveIndex(normalized);
        onSelect?.(items[normalized]);
      }
    });
  }, [smoothDrum, activeIndex, numItems, items, onSelect]);

  const advance = useCallback(
    (direction = 1) => {
      const current = drumIndex.get();
      drumIndex.set(Math.round(current) + direction);
    },
    [drumIndex]
  );

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => advance(1), interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, interval, advance]);

  // Non-passive wheel scrubbing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY * 0.0035;
      drumIndex.set(drumIndex.get() + delta);

      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(() => {
        drumIndex.set(Math.round(drumIndex.get()));
      }, 160);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [drumIndex]);

  const isDark = theme === 'dark';
  const rowHeight = 62;
  const viewportHeight = 190;
  const baseCenter = Math.floor(displayPos);
  const visibleSlots = [-2, -1, 0, 1, 2];

  return (
    <div
      ref={containerRef}
      onClick={() => advance(1)}
      className={`relative w-full max-w-full flex items-center justify-center select-none cursor-pointer py-4 px-2 ${className}`}
      style={{ perspective: '950px', touchAction: 'none' }}
      title="クリックまたはマウスホイールで回転"
    >
      {/* Subtle brand ambient glow matching DuoStats emerald palette */}
      <div className="absolute w-72 sm:w-96 h-28 bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl pointer-events-none rounded-full -z-10" />

      {/* Centered lockup with fluid responsive typography */}
      <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 md:gap-5 max-w-full overflow-visible">
        {/* Centered Prefix */}
        <span
          className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight font-sans antialiased shrink-0 text-right leading-none ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {prefix}
        </span>

        {/* 3D Cylindrical Tumbler Viewport centered */}
        <div
          className="relative overflow-hidden flex items-center justify-start w-[180px] sm:w-[270px] md:w-[350px] lg:w-[410px] shrink-0 text-left"
          style={{
            height: `${viewportHeight}px`,
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
          }}
        >
          {/* Target Element: 3D Tumbler Track */}
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {visibleSlots.map((slotOffset) => {
              const itemGlobalIndex = baseCenter + slotOffset;
              const offset = itemGlobalIndex - displayPos;
              const absOffset = Math.abs(offset);
              const itemIndex = ((itemGlobalIndex % numItems) + numItems) % numItems;
              const itemLabel = items[itemIndex];

              const y = offset * rowHeight;
              const rotateX = offset * -32;
              const scale = Math.max(0.82, 1 - absOffset * 0.1);
              const opacity =
                absOffset < 0.45
                  ? 1 - absOffset * 0.4
                  : Math.max(0.08, 0.42 - (absOffset - 0.45) * 0.32);

              const isCenter = absOffset < 0.45;

              return (
                <div
                  key={`${itemGlobalIndex}`}
                  className="absolute left-0 right-0 flex items-center justify-start pointer-events-none transform-gpu text-left"
                  style={{
                    top: `calc(50% - ${rowHeight / 2}px)`,
                    height: `${rowHeight}px`,
                    transform: `translateY(${y}px) translateZ(${
                      -absOffset * 20
                    }px) rotateX(${rotateX}deg) scale(${scale})`,
                    transformOrigin: 'left center',
                    opacity,
                  }}
                >
                  <span
                    className={`font-sans tracking-tight whitespace-nowrap antialiased leading-none text-left ${
                      isCenter
                        ? isDark
                          ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-emerald-400 drop-shadow-[0_0_24px_rgba(52,211,153,0.35)]'
                          : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-emerald-600 drop-shadow-xs'
                        : isDark
                        ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-500/70'
                        : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-400/80'
                    }`}
                  >
                    {itemLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TextReelHeadlineProps {
  language: Language;
  isDarkMode?: boolean;
}

export default function TextReelHeadline({ language, isDarkMode = true }: TextReelHeadlineProps) {
  // Use stats mode directly from the start
  const items = language === 'ja' ? STATS_ITEMS_JA : STATS_ITEMS_EN;
  const prefix = language === 'ja' ? 'DuoStatsで' : 'we track';

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      <KineticReelText
        prefix={prefix}
        items={items}
        interval={2400}
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </div>
  );
}
