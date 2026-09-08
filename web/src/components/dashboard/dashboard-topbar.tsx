"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  LOGOUT_MUTATION,
  type LogoutResult,
} from "@/lib/graphql/auth";

export function DashboardTopbar({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [logout, { loading }] = useMutation<LogoutResult>(LOGOUT_MUTATION);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

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
        <Button variant="ghost" onClick={handleLogout} disabled={loading}>
          Log out
        </Button>
      </div>
    </header>
  );
}
