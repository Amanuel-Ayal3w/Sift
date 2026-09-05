import { DashboardPreview } from "@/components/graphics/dashboard-ui";

function BeforeLead() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
        <div className="size-8 rounded-full bg-muted" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            New form submission
          </p>
          <p className="text-[10px] text-muted-foreground/60">sarah@acme.io</p>
        </div>
      </div>
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Name: Sarah Chen</p>
        <p>Company: Acme Corp</p>
        <p>Role: VP Sales</p>
        <p className="pt-2 italic text-muted-foreground/50">
          No score. No enrichment. No reply drafted.
        </p>
      </div>
      <div className="mt-4 rounded-lg bg-muted/50 px-3 py-2 text-center text-[10px] text-muted-foreground">
        Sitting in your inbox unread
      </div>
    </div>
  );
}

function AfterLead() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-black/30">
      <DashboardPreview compact />
    </div>
  );
}

export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="flex items-start justify-center gap-4 sm:gap-8">
        <div className="relative w-[34%] shrink-0">
          <p className="mb-3 text-center text-xs font-medium text-muted-foreground sm:text-sm">
            Before Sift
          </p>
          <BeforeLead />
        </div>

        <div className="mt-20 hidden shrink-0 sm:block">
          <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden>
            <path
              d="M0 12h32m0 0l-6-6m6 6l-6 6"
              stroke="#baff39"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative w-[60%] shrink-0 overflow-x-auto">
          <p className="mb-3 text-center text-xs font-medium text-primary sm:text-sm">
            With Sift
          </p>
          <AfterLead />
        </div>
      </div>
    </div>
  );
}
