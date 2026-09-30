"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  Inbox,
  ListFilter,
  SlidersHorizontal,
  Plug,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { LEADS_QUERY, type LeadsResult, type LeadsVars } from "@/lib/graphql/leads";

export function DashboardSidebar({ workspaceName }: { workspaceName: string }) {
  const pathname = usePathname();
  const { data } = useQuery<LeadsResult, LeadsVars>(LEADS_QUERY, {
    variables: { status: "NEW", limit: 200 },
  });
  const newLeadsCount = data?.leads.length ?? 0;

  const navItems = [
    { label: "Inbox", href: "/dashboard", icon: Inbox, count: newLeadsCount },
    { label: "Leads", href: "/dashboard/leads", icon: ListFilter },
    { label: "Criteria", href: "/dashboard/criteria", icon: SlidersHorizontal },
    { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="hidden w-[232px] shrink-0 flex-col border-r border-border bg-background sm:flex">
      <Link
        href="/"
        className="px-5 pt-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to site
      </Link>

      <div className="px-5 pt-5 pb-2">
        <Logo className="[&_span]:text-[15px]" />
      </div>

      <div className="px-5 pt-4 pb-3">
        <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Workspace
        </p>
        <p className="mt-1 truncate text-sm font-medium text-foreground">
          {workspaceName}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-1">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="size-4" />
                {item.label}
              </span>
              {!!item.count && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-semibold",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        <ThemeToggle showLabel />
      </div>
    </aside>
  );
}
