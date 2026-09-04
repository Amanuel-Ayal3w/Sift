import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function DashboardTopbar({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/">Log out</Link>}
        />
      </div>
    </header>
  );
}
