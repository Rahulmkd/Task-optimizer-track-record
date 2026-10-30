"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginSchema, LoginUserFormData } from "../schemas/auth.schema";
import { useAppDispatch } from "@/redux/hooks";
import { loginUserThunk } from "@/redux/slices/auth.slice";

import { DEMO_CREDENTIALS, ROUTES } from "@/constants/constants";

import { FormField } from "@/components/shared/FormField";
import { PasswordInput } from "@/components/shared/PasswordInput";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginUserFormData) => {
    try {
      await dispatch(loginUserThunk(data)).unwrap();
      toast.success("Welcome back!");
      router.replace(ROUTES.DASHBOARD);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Invalid email or password";

      toast.error(message);
      setError("root", {
        type: "server",
        message,
      });
    }
  };

  const fillDemo = () => {
    setValue("email", DEMO_CREDENTIALS.email, {
      shouldValidate: true,
    });
    setValue("password", DEMO_CREDENTIALS.password, {
      shouldValidate: true,
    });
    toast.info("Demo credentials loaded!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      {/* Demo Banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 sm:p-3.5"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-violet-300">Try Instant Demo</p>
            <p className="text-[11px] text-white/50 truncate">
              {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillDemo}
          className="border-violet-500/30 text-violet-300 hover:bg-violet-500/20 shrink-0 text-xs font-semibold h-8"
        >
          Auto-fill
        </Button>
      </motion.div>

      {errors.root?.message && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-400 font-medium animate-fade-in">
          {errors.root.message}
        </div>
      )}

      <FormField
        id="email"
        label="Email address"
        required
        error={errors.email?.message}
      >
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      </FormField>

      <FormField
        id="password"
        label="Password"
        required
        error={errors.password?.message}
      >
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 z-10" />
          <PasswordInput
            id="password"
            placeholder="••••••••"
            className="pl-10"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
      </FormField>

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="group flex cursor-pointer items-center gap-2 text-white/60 hover:text-white transition-colors">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded-md border-white/20 bg-white/5 accent-violet-600 focus:ring-violet-500/40"
          />
          <span>Remember me</span>
        </label>

        <span className="text-white/40 hover:text-violet-300 transition-colors cursor-pointer" onClick={() => toast.info("Demo account has reset capabilities.")}>
          Forgot password?
        </span>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={isSubmitting}
        className="group w-full font-semibold mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span>Signing in...</span>
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>Sign in to Dashboard</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>

      <p className="text-center text-xs text-white/50 pt-2">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-violet-400 hover:text-violet-300 transition-colors underline-offset-4 hover:underline"
        >
          Create account free
        </Link>
      </p>
    </form>
  );
}
