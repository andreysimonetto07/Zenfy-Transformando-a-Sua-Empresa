export default function GrowthMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 150" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="growth-a" x1="20" y1="120" x2="155" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#12D4E5"/>
          <stop offset=".42" stopColor="#1769FF"/>
          <stop offset=".74" stopColor="#7437FF"/>
          <stop offset="1" stopColor="#E449F2"/>
        </linearGradient>
        <linearGradient id="growth-b" x1="32" y1="128" x2="135" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1ED5E8"/>
          <stop offset=".48" stopColor="#154EEB"/>
          <stop offset="1" stopColor="#9B38FF"/>
        </linearGradient>
      </defs>
      <path d="M21 98C49 83 70 65 90 43c10-11 21-18 38-19l-9-11 42 5-7 42-10-13c-20 2-32 13-44 26-18 20-38 37-67 52-11 6-23-20-12-27Z" fill="url(#growth-a)"/>
      <path d="M26 118c25-10 48-25 70-48 8-9 16-15 27-18-7 11-9 23-7 35-20 19-42 34-69 45-13 5-30-8-21-14Z" fill="url(#growth-b)" opacity=".98"/>
      <path d="M34 91c15-5 31-14 45-26-11 16-18 30-20 43-8 5-16 9-25 13-12 5-14-24 0-30Z" fill="#25D6E7" opacity=".9"/>
    </svg>
  );
}
