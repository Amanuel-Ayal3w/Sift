export type DemoLeadInput = {
  fullName: string;
  email: string;
  companyName?: string;
  message: string;
  source: string;
};

export async function submitDemoLead(input: DemoLeadInput) {
  const res = await fetch("/api/demo-lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(json.error || "Could not submit this lead.");
  }
}
