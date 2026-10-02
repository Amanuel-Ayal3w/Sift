import { cn } from "@/lib/utils";

export function DarkGradient({
  className,
  subtle = false,
}: {
  className?: string;
  subtle?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 hidden dark:block", className)}
    >
      {subtle ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,_#4c9d73_0%,_transparent_60%)] opacity-[0.18]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#6ec89a_0%,_transparent_55%)] opacity-[0.08]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#6ec89a_0%,_transparent_55%)] opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,_#4c9d73_0%,_transparent_40%)] opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#4c9d73_0%,_transparent_45%)] opacity-35" />
        </>
      )}
    </div>
  );
}
