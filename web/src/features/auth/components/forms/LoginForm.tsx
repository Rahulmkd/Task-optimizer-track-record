"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginSchema, LoginUserFormData } from "../../schemas/auth.schema";
import { useAppDispatch } from "@/redux/hooks";
import { loginUserThunk } from "@/redux/slices/auth.slice";

import { DEMO_CREDENTIALS } from "@/constants/constants";

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
    watch,
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

      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Invalid credentials";

      toast.error(message);

      setError("root", {
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

    toast.info("Demo credentials filled!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Demo Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/10 p-3"
      >
        <div>
          <p className="text-xs font-medium text-violet-300">Try the demo</p>
          <p className="text-xs text-white/40">admin@example.com · 123456</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillDemo}
          className="border-violet-500/40 text-violet-300 hover:bg-violet-500/20"
        >
          Fill
        </Button>
      </motion.div>

      {errors.root?.message && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
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
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            className="pl-9"
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
          <Lock className="absolute left-3 top-[10px] z-10 h-4 w-4 text-white/30" />

          <PasswordInput
            id="password"
            placeholder="Enter your password"
            className="pl-9"
            value={watch("password")}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
      </FormField>

      <div className="flex items-center justify-between">
        <label className="group flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 checked:border-violet-600 checked:bg-violet-600"
          />

          <span className="text-sm text-white/50 transition-colors group-hover:text-white/70">
            Remember me
          </span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm text-violet-400 transition-colors hover:text-violet-300"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={isSubmitting}
        className="group w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span>Verifying...</span>
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Sign in
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Create one free
        </Link>
      </p>
    </form>
  );
}
