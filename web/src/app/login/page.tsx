"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import {
  LOGIN_MUTATION,
  type LoginResult,
  type LoginVars,
} from "@/lib/graphql/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation<LoginResult, LoginVars>(
    LOGIN_MUTATION
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ variables: { input: { email, password } } });
      router.push("/dashboard");
      router.refresh();
    } catch {
      // surfaced via `error` below
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your Sift workspace to manage leads and pipelines."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Sign up for free
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <AuthField
          id="email"
          label="Work email"
          type="email"
          placeholder="jane@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
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
          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
        >
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
