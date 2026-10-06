"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  PLATFORM_LOGOUT_MUTATION,
  type PlatformLogoutResult,
} from "@/lib/graphql/platform";

export function AdminTopbar({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [logout, { loading }] = useMutation<PlatformLogoutResult>(
    PLATFORM_LOGOUT_MUTATION,
  );

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="flex items-start justify-between px-8 pt-8 pb-2">
      <div>
        <h1 className="text-[28px] font-medium tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={loading}
          className="text-muted-foreground"
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
