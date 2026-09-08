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
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border bg-card sm:flex">
      <div className="border-b border-border px-5 py-4">
        <Logo />
        <p className="mt-1 text-xs text-muted-foreground">{workspaceName}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="size-4" />
                {item.label}
              </span>
              {!!item.count && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-black">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
