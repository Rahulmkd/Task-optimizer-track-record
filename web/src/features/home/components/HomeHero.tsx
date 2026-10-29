"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  BarChart2,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_CREDENTIALS, ROUTES } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUserThunk } from "@/redux/slices/auth.slice";
import { toast } from "sonner";
import { useIsMounted } from "@/hooks/useIsMounted";

export function HomeHero() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useIsMounted();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const isAuth = mounted && isAuthenticated;

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoggingIn(true);
      await dispatch(loginUserThunk(DEMO_CREDENTIALS)).unwrap();
      toast.success("Welcome to Task Optimizer Demo!");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const message = typeof err === "string" ? err : "Could not sign in to demo account";
      toast.error(message);
      router.push(ROUTES.LOGIN);
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-medium text-violet-300 backdrop-blur-md mb-8 hover:bg-violet-500/15 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
          <span>Full-Stack Productivity Ecosystem with Dual-Engine AI</span>
          <span className="h-1 w-1 rounded-full bg-violet-400" />
          <span className="text-white/60">IST Timezone Aware</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
        >
          Plan with Precision.
          <br />
          Execute with Focus.
          <br />
          <span className="text-gradient">Optimize with AI.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-white/60 leading-relaxed font-normal"
        >
          Stop scattering your priorities across disconnected tools. Unify daily time-blocking,
          7-day capacity planning, mathematical SVG analytics, and an automated AI coach in one
          fast, distraction-free command center.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto"
        >
          {isAuth ? (
            <>
              <Button
                size="lg"
                variant="gradient"
                onClick={() => router.push(ROUTES.DASHBOARD)}
                className="w-full sm:w-auto h-12 px-7 text-sm font-semibold shadow-lg shadow-violet-900/40"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push(ROUTES.MY_TASK)}
                className="w-full sm:w-auto h-12 px-6 text-sm font-semibold"
              >
                <CalendarCheck className="h-4 w-4 mr-2 text-violet-400" />
                <span>My Tasks</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="w-full sm:w-auto h-12 px-7 text-sm font-semibold shadow-lg shadow-violet-900/40"
              >
                <Link href={ROUTES.REGISTER}>
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleDemoLogin}
                disabled={isDemoLoggingIn}
                className="w-full sm:w-auto h-12 px-6 text-sm font-semibold border-violet-500/30 hover:border-violet-500/50 hover:bg-violet-500/10"
              >
                {isDemoLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-violet-400" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2 text-violet-400" />
                    <span>Try Instant Demo</span>
                  </>
                )}
              </Button>
            </>
          )}
        </motion.div>

        {/* User Context & Demo Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-4 text-xs text-white/40"
        >
          {isAuth ? (
            <p className="flex items-center justify-center gap-1.5 text-emerald-400/90 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Logged in as {user?.name || user?.email} • Ready to organize today
            </p>
          ) : (
            <p>
              Pre-loaded demo: <code className="text-violet-300 font-mono">admin@example.com</code> • No credit card required
            </p>
          )}
        </motion.div>

        {/* Key Architectural Proof Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm text-left hover:border-violet-500/30 transition-colors">
            <div className="flex items-center gap-2 text-violet-400 mb-1">
              <BarChart2 className="h-4 w-4" />
              <span className="text-xs font-semibold text-white">Custom SVG Engine</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Mathematical curves & radial score rings with zero third-party chart bloat.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm text-left hover:border-violet-500/30 transition-colors">
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold text-white">Dual AI Core</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Google Gemini 2.5 Flash with Groq LLaMA 3.3 70B instant fallback.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm text-left hover:border-violet-500/30 transition-colors">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Layers className="h-4 w-4" />
              <span className="text-xs font-semibold text-white">7-Day Sprints</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Monday-anchored capacity planning, priority tiers & overdue task alerts.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm text-left hover:border-violet-500/30 transition-colors">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-semibold text-white">Dual-Token Auth</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              SHA-256 rotated HTTP cookies, in-memory JWTs & timing-attack safety.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
