export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
      <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/70" />
      <svg width="34" height="14" viewBox="0 0 34 14" fill="none" className="text-gold">
        <path d="M2 7 Q9 0 17 7 Q25 14 32 7" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" />
      </svg>
      <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}

export function Gunungan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden>
      <defs>
        <linearGradient id="goldgrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.13 85)" />
          <stop offset="100%" stopColor="oklch(0.6 0.12 70)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#goldgrad)" strokeWidth="1.2">
        <path d="M100 6 C 120 50, 160 80, 168 140 C 172 180, 140 210, 100 212 C 60 210, 28 180, 32 140 C 40 80, 80 50, 100 6 Z" />
        <path d="M100 20 C 116 58, 150 86, 156 138 C 158 172, 132 198, 100 200 C 68 198, 42 172, 44 138 C 50 86, 84 58, 100 20 Z" />
        <circle cx="100" cy="110" r="6" />
        <circle cx="100" cy="110" r="14" />
        <circle cx="100" cy="110" r="24" />
        <path d="M100 50 v40 M100 130 v40 M70 110 h20 M110 110 h20" strokeLinecap="round" />
        <path d="M85 80 Q100 70 115 80 M85 140 Q100 150 115 140" />
        <path d="M60 100 Q50 110 60 120 M140 100 Q150 110 140 120" />
      </g>
    </svg>
  );
}

export function CornerFloral({
  className = "",
  flip = false,
  style,
}: {
  className?: string;
  flip?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={style ?? (flip ? { transform: "scaleX(-1)" } : undefined)}
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M2 2 Q40 6 60 30 Q80 54 60 80 Q40 100 6 110" />
        <path d="M14 8 Q34 22 36 44" />
        <path d="M30 12 Q44 28 42 50" />
        <circle cx="58" cy="30" r="4" />
        <circle cx="70" cy="48" r="3" />
        <circle cx="60" cy="68" r="3" />
        <path d="M50 24 q6 -8 14 -4 q4 6 -2 12 q-8 4 -12 -8z" fill="currentColor" opacity="0.25" />
        <path d="M64 56 q8 -2 10 6 q-2 8 -10 6 q-6 -4 0 -12z" fill="currentColor" opacity="0.25" />
      </g>
    </svg>
  );
}
