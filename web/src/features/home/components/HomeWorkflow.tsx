"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Calendar,
    title: "Structure the Sprint",
    subtitle: "Capacity & Priority Weighting",
    description:
      "Map your priorities across the Monday-anchored calendar. Assign High, Medium, or Low tags with estimated durations to avoid overcommitting.",
  },
  {
    step: "02",
    icon: CheckCircle2,
    title: "Execute Daily Timeblocks",
    subtitle: "Laser Focus & Optimistic Updates",
    description:
      "Tackle discrete AM/PM time blocks. Check off completed items with instantaneous Redux Toolkit cache updates and zero perceived network latency.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Automate Daily Retrospective",
    subtitle: "AI Evaluation & Score Generation",
    description:
      "Run the AI coach at day's end. Review an executive synthesis, check your 0–100 score, and inspect your actionable tip before saving it permanently.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Calibrate & Level Up",
    subtitle: "Visual Curves & Trend Deltas",
    description:
      "Study your 14-session mathematical SVG trends and completion ratios. Spot productivity dips and calibrate the next week's capacity accordingly.",
  },
];

export function HomeWorkflow() {
  return (
    <section id="workflow" className="py-20 relative bg-white/[0.01]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 mb-3">
            <span>Continuous Optimization Loop</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How Task Optimizer Drives Your Growth
          </h2>
          <p className="mt-4 text-base text-white/60">
            A battle-tested 4-step workflow that turns ambitious goals into measurable daily output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative rounded-2xl border border-white/10 bg-[#0f0f18]/80 p-6 backdrop-blur-xl hover:border-violet-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-violet-400/40">{s.step}</span>
                    <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
                  <span className="text-[11px] font-semibold text-violet-400 block mb-3">
                    {s.subtitle}
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed">{s.description}</p>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-white/20">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
