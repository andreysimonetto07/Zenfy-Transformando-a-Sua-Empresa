export default function ZenfyMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="zenfy-z" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#19D3E7" />
          <stop offset=".42" stopColor="#1769FF" />
          <stop offset=".74" stopColor="#7437FF" />
          <stop offset="1" stopColor="#E449F2" />
        </linearGradient>
      </defs>
      <path d="M14 15h34c3 0 4.7 3.5 2.6 5.6L25 43h24c3.9 0 5.6 4.9 2.6 7.2-1 .8-2.1 1.2-3.5 1.2H15.8c-4 0-5.7-5-2.7-7.4l25.3-21.7H14c-4.9 0-4.9-7.3 0-7.3Z" fill="url(#zenfy-z)"/>
      <path d="M20 21.5h21.7L19 41" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}
