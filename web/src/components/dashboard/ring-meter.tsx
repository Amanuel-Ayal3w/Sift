export function RingMeter({ percent }: { percent: number }) {
  const pct = Math.min(100, Math.max(0, percent));
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <svg viewBox="0 0 48 48" className="size-14 -rotate-90" aria-hidden>
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        className="text-muted-foreground/20"
      />
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        className="text-primary"
      />
    </svg>
  );
}
