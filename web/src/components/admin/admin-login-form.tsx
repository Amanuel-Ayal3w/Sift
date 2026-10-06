"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import {
  PLATFORM_LOGIN_MUTATION,
  type PlatformLoginResult,
  type PlatformLoginVars,
} from "@/lib/graphql/platform";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation<
    PlatformLoginResult,
    PlatformLoginVars
  >(PLATFORM_LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ variables: { input: { email, password } } });
      router.push("/admin");
      router.refresh();
    } catch {
      // surfaced via `error` below
    }
  };

  return (
    <AuthLayout
      title="Platform admin"
      subtitle="Sign in to manage every Sift workspace."
      footer={
        <Link
          href="/login"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Workspace login
        </Link>
      }
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <AuthField
          id="email"
          label="Admin email"
          type="email"
          placeholder="ops@sift.io"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-destructive">{error.message}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
