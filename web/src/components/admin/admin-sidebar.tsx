"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Workspaces", href: "/admin/workspaces", icon: Building2 },
  { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-border px-4 py-3 sm:hidden">
      {navItems.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm",
              active
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

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
          Super admin
        </p>
        <p className="mt-1 truncate text-sm font-medium text-foreground">{email}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-1">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
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
