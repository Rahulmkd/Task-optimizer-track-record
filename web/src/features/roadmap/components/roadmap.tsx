"use client";

import { motion } from "framer-motion";
import {
  Map,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/constants/constants";
import { Button } from "@/components/ui/button";

const ROADMAP_TRACKS = [
  {
    id: "sde-dsa",
    icon: Code2,
    title: "SDE & Algorithms Mastery",
    level: "Core Track",
    badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    description:
      "Master foundational data structures, algorithmic problem-solving patterns, dynamic programming, and technical interview benchmarks.",
    topics: [
      "Arrays, Strings & Two Pointers",
      "Trees, Graphs & BFS/DFS",
      "Dynamic Programming & Greedy",
      "Mock Interviews & Complexity Analysis",
    ],
  },
  {
    id: "fullstack",
    icon: Layers,
    title: "Modern Full-Stack Architecture",
    level: "Production Ready",
    badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    description:
      "Build reactive, server-rendered applications with Next.js 16, React 19, Redux Toolkit, and Tailwind CSS v4 design systems.",
    topics: [
      "App Router & Server Components",
      "RTK Query & Optimistic Cache",
      "State Machines & Framer Motion",
      "Web Performance & Core Vitals",
    ],
  },
  {
    id: "backend-systems",
    icon: Database,
    title: "Backend & Database Engineering",
    level: "Deep Dive",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    description:
      "Architect resilient REST & GraphQL APIs using Express, TypeScript, PostgreSQL, and Prisma with multi-tenant data shielding.",
    topics: [
      "Layered Controller/Service/Repo",
      "Prisma ORM & Connection Pooling",
      "Redis Caching & Queue Processing",
      "Strict Zod Contract Validation",
    ],
  },
  {
    id: "system-design",
    icon: Cpu,
    title: "System Design & Distributed Systems",
    level: "High Scale",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    description:
      "Scale systems from hundreds to millions of concurrent users. Learn sharding, consistency models, load balancing, and fault tolerance.",
    topics: [
      "High-Level Architecture Diagrams",
      "CAP Theorem & Replication",
      "Message Brokers (Kafka/RabbitMQ)",
      "Rate Limiting & CDN Strategies",
    ],
  },
  {
    id: "security-devops",
    icon: ShieldCheck,
    title: "Security, Auth & DevOps",
    level: "Enterprise Hardening",
    badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    description:
      "Implement bank-grade authentication lifecycle, HTTP-only cookie rotations, CI/CD pipelines, Docker containerization, and monitoring.",
    topics: [
      "Dual-Token Lifecycle & SHA-256 Rotation",
      "Timing Attack Defenses & Rate Limits",
      "Docker Multi-Stage Container Builds",
      "Zero Downtime Deployment Pipelines",
    ],
  },
  {
    id: "career-playbook",
    icon: Compass,
    title: "Career Growth & Engineering Leadership",
    level: "Career Strategy",
    badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    description:
      "Align daily tactical execution with long-term engineering levels, portfolio architecture reviews, and high-impact project leadership.",
    topics: [
      "Sprint Planning & Velocity Tracking",
      "Technical Design RFC Authorship",
      "Cross-Functional Team Collaboration",
      "Senior Engineer Impact Criteria",
    ],
  },
];

export function Roadmapsh() {
  const handleOpenExternal = () => {
    window.open(ROUTES.ROADMAP, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* ── Top Hero Banner ────────────────────────────────────────── */}
      <div className="p-5 sm:p-7 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/30 via-white/[0.02] to-transparent backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Decorative blur */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>Developer Growth &amp; Milestones</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
              <Map className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Engineering Career Roadmaps
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
            Bridge your daily task execution with structured long-term skill acquisition. Follow curated learning pathways designed for modern software engineers.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleOpenExternal}
            className="shadow-lg shadow-violet-950/40"
          >
            <span>Launch Roadmap Portal</span>
            <ExternalLink className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* ── Pathway Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROADMAP_TRACKS.map((track, index) => {
          const Icon = track.icon;
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between hover:border-violet-500/30 hover:bg-white/[0.06] transition-all group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-violet-300 group-hover:border-violet-500/30 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${track.badgeColor}`}>
                    {track.level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                  {track.title}
                </h3>

                <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                  {track.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
                    Core Milestones:
                  </span>
                  <ul className="space-y-1.5">
                    {track.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-xs text-white/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                        <span className="truncate">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-violet-600/20 text-white/80 hover:text-white border border-white/10 hover:border-violet-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Explore Track Curriculum</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
