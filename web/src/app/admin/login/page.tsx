import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getPlatformSession } from "@/lib/platform-session";

export default async function AdminLoginPage() {
  const session = await getPlatformSession();
  if (session) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
