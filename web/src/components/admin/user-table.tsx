"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PlatformUser } from "@/lib/graphql/platform";
import { formatRelativeTime } from "@/lib/utils";

export function UserTable({
  users,
  limit,
  loading = false,
  emptyLabel = "No users yet.",
}: {
  users: PlatformUser[];
  limit?: number;
  loading?: boolean;
  emptyLabel?: string;
}) {
  const rows = limit ? users.slice(0, limit) : users;

  if (loading && rows.length === 0) {
    return <p className="px-2 py-8 text-sm text-muted-foreground">Loading users…</p>;
  }

  if (rows.length === 0) {
    return <p className="px-2 py-8 text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Workspace</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{user.workspaceName}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatRelativeTime(user.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
