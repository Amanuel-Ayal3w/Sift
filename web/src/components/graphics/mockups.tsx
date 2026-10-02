import { CriteriaMockup, LeadAnalysisMockup } from "@/components/graphics/dashboard-ui";

export function DashboardMockup() {
  return (
    <div className="relative">
      <svg
        className="absolute -top-6 -right-4 size-16 text-foreground/40"
        viewBox="0 0 64 64"
        aria-hidden
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>
      <LeadAnalysisMockup />
    </div>
  );
}

export function WorkflowMockup() {
  return (
    <div className="relative">
      <svg
        className="absolute -top-4 -right-8 size-12 text-foreground/40"
        viewBox="0 0 48 48"
        aria-hidden
      >
        <text x="8" y="32" fontSize="28" fill="currentColor">
          ✦
        </text>
      </svg>
      <CriteriaMockup />
    </div>
  );
}
