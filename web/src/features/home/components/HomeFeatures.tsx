"use client";

import { motion } from "framer-motion";
import {
  ListTodo,
  Calendar,
  Sparkles,
  BarChart3,
  Map,
  Shield,
  CheckCircle,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: ListTodo,
    title: "Daily Time-Blocked Execution",
    badge: "Immediate Focus",
    tone: "violet",
    description:
      "Create, categorize, and schedule daily tasks with precise time pickers. Group items under custom Action projects with instantaneous optimistic UI feedback and rollback safeguards.",
    points: [
      "Custom Action / Project categorizations",
      "Granular HH:MM AM/PM time tagging",
      "Optimistic RTK Query checkbox toggles",
    ],
  },
  {
    icon: Calendar,
    title: "7-Day Sprint Capacity Planner",
    badge: "Sprint Planning",
    tone: "indigo",
    description:
      "Monday-anchored sprint calendar distributing tasks across the week. Assign priority tiers, custom duration estimates, and automatically highlight overdue items from earlier in the week.",
    points: [
      "Monday-to-Sunday sprint calendar alignment",
      "HIGH, MEDIUM & LOW priority weighting",
      "Real-time weekly progress & overdue detection",
    ],
  },
  {
    icon: Sparkles,
    title: "Dual-Engine AI Productivity Coach",
    badge: "Intelligent Guidance",
    tone: "sky",
    description:
      "Powered by LangChain with Google Gemini 2.5 Flash and instant Groq LLaMA 3.3 fallback. Generates daily summaries, computes 0-100 productivity scores, and prescribes actionable tomorrow-tips.",
    points: [
      "Two-step pipeline: Preview before persisting",
      "Timezone-aware task ingestion (UTC+5:30 IST)",
      "Strict Zod schema parsing on LLM outputs",
    ],
  },
  {
    icon: BarChart3,
    title: "Zero-Bloat Custom SVG Analytics",
    badge: "High Performance",
    tone: "emerald",
    description:
      "Lightning-fast mathematical SVG charts and Framer Motion animations without the overhead of heavy third-party chart libraries. Visualize 14-day trends and radial score rings with silky 60 FPS fluidity.",
    points: [
      "Dynamic SVG cubic-bezier trend curves",
      "Radial gauges with tier color coding",
      "Historical averages & personal best tracking",
    ],
  },
  {
    icon: Map,
    title: "Developer & Career Roadmaps",
    badge: "Long-Term Vision",
    tone: "amber",
    description:
      "Bridge daily tactical execution with overarching career growth. One-click integration with software engineering and system design roadmaps to keep your skills evolving.",
    points: [
      "Integrated software engineering pathways",
      "Aligns daily work with career milestones",
      "Direct roadmap external navigation",
    ],
  },
  {
    icon: Shield,
    title: "Enterprise Dual-Token Security",
    badge: "Bank-Grade Safety",
    tone: "rose",
    description:
      "Dual-token architecture with in-memory Access Tokens, SHA-256 hashed single-use Refresh Tokens in HTTP-only cookies, constant-time password comparisons, and multi-device revocation.",
    points: [
      "Automatic silent token rotation queue",
      "Database-level SHA-256 token hashing",
      "Tiered rate limiters & complete account purge",
    ],
  },
];

export function HomeFeatures() {
  return (
    <section id="features" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 mb-3">
            <Zap className="h-3.5 w-3.5 text-violet-400" />
            <span>Comprehensive Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything You Need to Dominate Your Workday
          </h2>
          <p className="mt-4 text-base text-white/60">
            A cohesive set of tools engineered to transform chaotic task lists into structured,
            data-driven achievement.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-2xl border border-white/10 bg-[#0f0f18]/80 p-6 backdrop-blur-xl hover:border-violet-500/40 hover:bg-[#12121f] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-white/40 group-hover:text-violet-300 transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Sub Bullet Points */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  {feature.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-white/70">
                      <CheckCircle className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
