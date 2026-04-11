export default function BrandMark({ className = '', compact = false }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-0' : 'gap-3'} ${className}`}>
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0f4ad7_0%,#0ea5e9_52%,#8b5cf6_100%)] shadow-[0_16px_36px_-18px_rgba(14,165,233,0.9)]">
        <svg viewBox="0 0 64 64" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="10" y="15" width="44" height="34" rx="14" fill="url(#cc-shell)" />
          <path d="M18 42V31.5C18 25.7 22.7 21 28.5 21H35.5C41.3 21 46 25.7 46 31.5V42" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M24 42V34C24 29.6 27.6 26 32 26C36.4 26 40 29.6 40 34V42" stroke="#BAE6FD" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="32" cy="21" r="3.5" fill="#F8FAFC" />
          <circle cx="18" cy="46" r="3" fill="#C4B5FD" />
          <circle cx="46" cy="46" r="3" fill="#C4B5FD" />
          <path d="M20.5 19.5L16 15" stroke="#C4B5FD" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M43.5 19.5L48 15" stroke="#C4B5FD" strokeWidth="2.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="cc-shell" x1="14" y1="17" x2="51" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1D4ED8" />
              <stop offset="0.55" stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {!compact && (
        <div>
          <div className="text-lg font-black tracking-tight text-gray-900 dark:text-gray-100">CampusConnect</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Student Events Network</div>
        </div>
      )}
    </div>
  );
}
