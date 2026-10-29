"use client";

import { Sparkles, Bot, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/constants";

export function HomeAICoachSection() {
  return (
    <section id="ai-coach" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-b from-[#131026] via-[#0f0e1a] to-[#0a0a0f] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl shadow-violet-950/30">
          {/* Subtle Ambient Orbs */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-25 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
              filter: "blur(70px)",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Column: Text & Architecture details */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-medium text-violet-300">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>Multi-Provider AI Architecture</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                An AI Coach That Knows Exactly How Your Day Unfolded
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                {"Task Optimizer doesn't just store tasks—it understands your pace. Powered by LangChain with instant multi-model fallback, our AI analyzes completed items, flags pending bottlenecks, calculates your productivity score, and provides a clear actionable strategy for tomorrow."}
              </p>

              {/* Technical Highlights list */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5 text-violet-300">
                    <Cpu className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      Dual-Provider Resiliency (Gemini & Groq)
                    </h4>
                    <p className="text-xs text-white/50">
                      Primary reasoning through Google Gemini 2.5 Flash, backed by instant Groq LLaMA 3.3
                      70B fallback to guarantee zero downtime.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5 text-violet-300">
                    <ShieldAlert className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      Two-Step Safe Generation Pipeline
                    </h4>
                    <p className="text-xs text-white/50">
                      {"First generates a non-destructive preview. You can review and refine the coach's analysis before committing it to your permanent journal."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5 text-violet-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      Strict Zod Schema & Timezone Ingestion
                    </h4>
                    <p className="text-xs text-white/50">
                      All LLM outputs are extracted from JSON fences and validated against strict Zod
                      schemas. Filtered precisely according to your UTC+5:30 IST day boundaries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild variant="gradient" size="default">
                  <Link href={ROUTES.REGISTER} className="flex items-center gap-2">
                    <span>Try the AI Productivity Coach</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Visual AI Journal Preview Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0e0c1a]/90 p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">AI Retrospective Card</span>
                    <span className="text-[10px] text-white/40">Timestamp: 21:45 IST • Model: Gemini 2.5</span>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  92% Productivity
                </span>
              </div>

              {/* Sample output mockup */}
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span>Task Execution Ratio</span>
                  <span className="text-white font-medium">8 Completed · 1 Pending</span>
                </div>

                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[89%]" />
                </div>

                <div className="pt-2 text-xs text-white/80 leading-relaxed font-sans">
                  {`"Exceptional execution on critical path tasks. Completed all architecture updates and database index optimizations during your prime morning cognitive window."`}
                </div>
              </div>

              {/* Actionable Tomorrow Tip Box */}
              <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
                <span className="text-[11px] font-bold text-violet-300 block mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-violet-400" />
                  Coach Directive For Tomorrow
                </span>
                <p className="text-xs text-violet-200/90 leading-relaxed">
                  {`"Batch tomorrow's administrative syncs into the 03:00 PM slot. Maintain 09:00 AM to 12:00 PM as zero-interruption deep work."`}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
                <span>Safe preview verified</span>
                <span className="text-emerald-400 font-medium">✓ Ready to save to journal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
