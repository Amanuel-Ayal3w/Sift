import { cn } from "@/lib/utils";

export function TierBadge({
  tier,
  className,
}: {
  tier: "HOT" | "WARM" | "COLD";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center rounded-full px-2 text-[11px] font-medium",
        tier === "HOT" && "bg-primary text-primary-foreground",
        tier === "WARM" && "bg-[#dce8df] text-[#4c9d73]",
        tier === "COLD" && "bg-muted text-muted-foreground",
        className
      )}
    >
      {tier}
    </span>
  );
}
