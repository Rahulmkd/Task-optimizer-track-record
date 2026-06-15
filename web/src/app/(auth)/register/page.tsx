import type { Metadata } from "next";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import RegisterForm from "@/features/auth/components/forms/RegisterForm";


export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join 50,000+ developers building with NexusAuth"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
