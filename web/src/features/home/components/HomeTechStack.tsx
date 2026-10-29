"use client";

import { motion } from "framer-motion";
import { Server, Layout, ShieldCheck, Cpu, Code2 } from "lucide-react";

const TECH_PILLARS = [
  {
    icon: Layout,
    title: "Client-Side Architecture",
    badge: "Next.js 16 + React 19",
    items: [
      "Next.js 16 App Router with server-side layout optimizations",
      "Tailwind CSS v4 with unified inline theme tokens",
      "Framer Motion custom SVG path mathematics & physics",
      "Redux Toolkit & RTK Query optimistic cache rollback",
    ],
  },
  {
    icon: Server,
    title: "Layered Backend API",
    badge: "Express 5 + TypeScript 6",
    items: [
      "Layered Controllers, Services, and Prisma Repositories",
      "Prisma ORM 7.8 connecting to PostgreSQL database",
      "Strict Zod schema validation across all request endpoints",
      "Strict ownership multi-tenant isolation with 404 shielding",
    ],
  },
  {
    icon: Cpu,
    title: "Resilient AI Engine",
    badge: "LangChain + Multi-LLM",
    items: [
      "Google Gemini 2.5 Flash as high-performance primary engine",
      "Groq Cloud (LLaMA 3.3 70B Versatile) instant fallback",
      "Dedicated JSON extractor with typed Zod output guarantees",
      "Configurable timezone offsets (UTC+5:30 IST default)",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Security & Auth Hardening",
    badge: "Dual-Token Lifecycle",
    items: [
      "In-memory short-lived Access Tokens never stored in WebStorage",
      "SHA-256 hashed single-use Refresh Tokens in HTTP-only cookies",
      "Constant-time dummy hash password lookup against timing attacks",
      "Single-session logout and multi-device revocation endpoints",
    ],
  },
];

export function HomeTechStack() {
  return (
    <section id="architecture" className="py-20 relative bg-white/[0.01]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 mb-3">
            <Code2 className="h-3.5 w-3.5 text-violet-400" />
            <span>Under The Hood</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered with Modern, Production-Grade Technology
          </h2>
          <p className="mt-4 text-base text-white/60">
            A look into the foundational architecture powering speed, high availability, and data
            integrity across the stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {TECH_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl border border-white/10 bg-[#0f0f18]/80 p-6 sm:p-7 backdrop-blur-xl hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-md">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-4">{pillar.title}</h3>

                <ul className="space-y-2.5">
                  {pillar.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5 text-xs text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
