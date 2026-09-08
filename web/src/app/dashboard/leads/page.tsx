"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { Input } from "@/components/ui/input";

export default function LeadsPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <DashboardTopbar
        title="Leads"
        description="Every lead your org has received, scored and searchable"
      />
      <main className="flex-1 space-y-4 p-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <LeadsTable search={search} />
      </main>
    </>
  );
}
