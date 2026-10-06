"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { UserTable } from "@/components/admin/user-table";
import { Input } from "@/components/ui/input";
import {
  PLATFORM_USERS_QUERY,
  type PlatformUsersResult,
} from "@/lib/graphql/platform";

export default function AdminUsersPage() {
  const { data, loading } = useQuery<PlatformUsersResult>(PLATFORM_USERS_QUERY);
  const [search, setSearch] = useState("");
  const users = data?.platformUsers ?? [];
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(needle) ||
        user.workspaceName.toLowerCase().includes(needle) ||
        user.role.toLowerCase().includes(needle),
    );
  }, [search, users]);

  return (
    <>
      <AdminTopbar
        title="Users"
        description="Everyone with a workspace account."
      />
      <main className="flex-1 space-y-4 px-8 pb-10 pt-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email, workspace, or role"
          className="h-11 max-w-sm rounded-xl"
        />
        <UserTable
          users={filtered}
          loading={loading}
          emptyLabel={search.trim() ? "No matching users." : "No users yet."}
        />
      </main>
    </>
  );
}
