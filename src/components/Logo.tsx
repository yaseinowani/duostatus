interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  subtitle?: string;
}

export default function Logo({ size = 'md', className = '', subtitle = '非公式 学習統計ファンサイト' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 tracking-tight ${className}`}>
      {/* Nordic Minimal Sprout & Chart Emblem */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white shadow-xs select-none relative flex-shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5/6 h-5/6 text-white"
        >
          <path d="M4 20h16" />
          <path d="M7 16V12" />
          <path d="M12 16V8" />
          <path d="M17 16V5" />
          <circle cx="17" cy="5" r="1.5" fill="#facc15" stroke="#facc15" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-extrabold ${textSizes[size]} text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-0.5`}>
          <span>Duo</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-black">Stats</span>
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-normal mt-0.5">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
