import "server-only";
import { cookies } from "next/headers";

export type Viewer = {
  id: string;
  email: string;
  role: string;
};

export type Session = {
  user: Viewer;
  workspaceName: string;
};

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/graphql";

/** Server-only: reads the httpOnly auth cookie and resolves the current session, if any. */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
    },
    body: JSON.stringify({
      query: `query Session { me { id email role } workspace { id name } }`,
    }),
    cache: "no-store",
  });

  const json = await res.json();
  if (json.errors || !json.data?.me) {
    return null;
  }

  return {
    user: json.data.me,
    workspaceName: json.data.workspace?.name ?? "",
  };
}
