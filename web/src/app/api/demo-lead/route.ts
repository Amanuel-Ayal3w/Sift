import { NextResponse } from "next/server";

type DemoLeadBody = {
  fullName?: string;
  email?: string;
  companyName?: string;
  message?: string;
  source?: string;
};

export async function POST(request: Request) {
  const webhookUrl = process.env.DEMO_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Demo ingest is not configured." },
      { status: 503 },
    );
  }

  let body: DemoLeadBody;
  try {
    body = (await request.json()) as DemoLeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const companyName = body.companyName?.trim() || undefined;
  const source = body.source?.trim() || "Public demo";

  if (!fullName || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName,
      email,
      companyName,
      message,
      source,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    return NextResponse.json(
      { error: detail || "Could not submit this lead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
