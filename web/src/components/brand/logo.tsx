import Link from "next/link";
import { cn } from "@/lib/utils";

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden
    >
      <rect width="24" height="24" rx="6" className="fill-primary" />
      <path
        d="M8 15V9l4-2.5L16 9v6l-4 2.5L8 15z"
        className="fill-primary-foreground"
      />
      <path
        d="M12 6.5v11"
        className="stroke-primary-foreground"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon />
      {showText && (
        <span className="text-xl font-bold tracking-tight">Sift</span>
      )}
    </Link>
  );
}

export { LogoIcon };
