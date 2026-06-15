"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  registerSchema,
  RegisterUserFormData,
} from "../../schemas/auth.schema";

import { useAppDispatch } from "@/redux/hooks";
import { registerUserThunk } from "@/redux/slices/auth.slice";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { FormField } from "@/components/shared/FormField";

const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One number",
    test: (password: string) => /[0-9]/.test(password),
  },
];

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterUserFormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      };

      await dispatch(registerUserThunk(payload)).unwrap();

      toast.success("Account created successfully");

      router.replace("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Registration failed";

      toast.error(message);

      setError("root", {
        type: "server",
        message,
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errors.root?.message && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {errors.root.message}
        </div>
      )}

      <FormField
        id="name"
        label="Full Name"
        required
        error={errors.name?.message}
      >
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            className="pl-9"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>
      </FormField>

      <FormField
        id="email"
        label="Email Address"
        required
        error={errors.email?.message}
      >
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="pl-9"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      </FormField>

      <FormField
        id="phone"
        label="Phone Number"
        required
        error={errors.phoneNumber?.message}
      >
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            className="pl-9"
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
        </div>
      </FormField>

      <FormField
        id="password"
        label="Password"
        required
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          showStrength
          value={password}
          error={errors.password?.message}
          {...register("password")}
        />
      </FormField>

      {password && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3"
        >
          {passwordRequirements.map((requirement) => {
            const met = requirement.test(password);

            return (
              <div key={requirement.label} className="flex items-center gap-2">
                {met ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-white/20" />
                )}

                <span
                  className={`text-xs ${
                    met ? "text-white/60" : "text-white/30"
                  }`}
                >
                  {requirement.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={watch("confirmPassword")}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={isSubmitting}
        className="w-full group"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            Creating account...
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Create account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-white/25">
        By creating an account you agree to our{" "}
        <Link
          href="/terms"
          className="underline transition-colors hover:text-white/40"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline transition-colors hover:text-white/40"
        >
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}
