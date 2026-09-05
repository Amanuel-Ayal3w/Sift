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
        "inline-flex h-5 w-fit shrink-0 items-center rounded-full px-2 text-xs font-bold",
        tier === "HOT" && "bg-primary text-black",
        tier === "WARM" && "bg-[#e8b44f] text-black",
        tier === "COLD" && "bg-muted text-muted-foreground",
        className
      )}
    >
      {tier}
    </span>
  );
}
