import { cn } from "@/lib/utils";

export function DarkGradient({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 hidden dark:block", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#baff39_0%,_transparent_50%)] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#e8b44f_0%,_transparent_40%)] opacity-10" />
    </div>
  );
}
