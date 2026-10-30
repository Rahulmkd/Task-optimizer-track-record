"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/constants";

import { registerSchema, RegisterUserFormData } from "../schemas/auth.schema";

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
    clearErrors,
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

  const password = watch("password") || "";

  const onSubmit = async (data: RegisterUserFormData) => {
    clearErrors("root");
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber?.trim() || "",
        password: data.password,
      };

      await dispatch(registerUserThunk(payload)).unwrap();
      toast.success("Account created successfully!");
      router.replace(ROUTES.DASHBOARD);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Registration failed. Please try again.";

      toast.error(message);
      setError("root", {
        type: "server",
        message,
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      {errors.root?.message && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-400 font-medium animate-fade-in">
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
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            className="pl-10"
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
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="pl-10"
            error={errors.email?.message}
            {...register("email", {
              onChange: () => clearErrors("root"),
            })}
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
          <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            className="pl-10"
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
          passwordValue={password}
          error={errors.password?.message}
          {...register("password")}
        />
      </FormField>

      {password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs"
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
                <span className={met ? "text-white/80 font-medium" : "text-white/40"}>
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
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={isSubmitting}
        className="w-full group font-semibold mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span>Creating account...</span>
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>Create Account</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>

      <p className="text-center text-xs text-white/50 pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-violet-400 hover:text-violet-300 transition-colors underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
