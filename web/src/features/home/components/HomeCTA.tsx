"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, LayoutDashboard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_CREDENTIALS, ROUTES } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUserThunk } from "@/redux/slices/auth.slice";
import { toast } from "sonner";
import { useState } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";

export function HomeCTA() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useIsMounted();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const isAuth = mounted && isAuthenticated;

  const handleDemo = async () => {
    try {
      setLoadingDemo(true);
      await dispatch(loginUserThunk(DEMO_CREDENTIALS)).unwrap();
      toast.success("Signed into demo workspace!");
      router.push(ROUTES.DASHBOARD);
    } catch {
      router.push(ROUTES.LOGIN);
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/60 via-[#131024] to-indigo-950/60 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl shadow-violet-950/40 overflow-hidden">
          {/* Background Ambient Glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-medium text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>Get Started in Under 60 Seconds</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Stop Reacting.
              <br />
              <span className="text-gradient">Start Optimizing Today.</span>
            </h2>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
              Join developers, engineers, and ambitious professionals organizing their daily execution
              and weekly sprints with Task Optimizer.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {isAuth ? (
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={() => router.push(ROUTES.DASHBOARD)}
                  className="w-full sm:w-auto h-12 px-8 text-sm font-semibold shadow-lg shadow-violet-900/40"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Open Your Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    variant="gradient"
                    className="w-full sm:w-auto h-12 px-8 text-sm font-semibold shadow-lg shadow-violet-900/40"
                  >
                    <Link href={ROUTES.REGISTER}>
                      <span>Create Free Account</span>
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDemo}
                    disabled={loadingDemo}
                    className="w-full sm:w-auto h-12 px-7 text-sm font-semibold border-white/20 hover:bg-white/10"
                  >
                    <Zap className="h-4 w-4 mr-2 text-violet-400" />
                    <span>{loadingDemo ? "Loading demo..." : "Explore Demo"}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
