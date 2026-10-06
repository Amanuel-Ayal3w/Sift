import "server-only";
import { cookies } from "next/headers";

export type PlatformSession = {
  id: string;
  email: string;
};

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/graphql";

/** Server-only: reads the platform admin cookie and resolves the operator, if any. */
export async function getPlatformSession(): Promise<PlatformSession | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieStore.toString(),
      },
      body: JSON.stringify({
        query: `query PlatformSession { platformMe { id email } }`,
      }),
      cache: "no-store",
    });

    const json = await res.json();
    if (json.errors || !json.data?.platformMe) {
      return null;
    }

    return json.data.platformMe;
  } catch {
    return null;
  }
}
