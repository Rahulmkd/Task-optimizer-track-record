import type { Metadata } from "next";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import LoginForm from "@/features/auth/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
}
