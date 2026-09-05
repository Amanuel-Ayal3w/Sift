import Link from "next/link";
import { AuthField } from "@/components/auth/auth-field";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
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
      <form className="flex flex-col gap-6">
        <AuthField
          id="email"
          label="Work email"
          type="email"
          placeholder="jane@company.com"
          autoComplete="email"
          required
        />

        <div>
          <AuthField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
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

        <Button
          type="submit"
          className="h-12 rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
        >
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
