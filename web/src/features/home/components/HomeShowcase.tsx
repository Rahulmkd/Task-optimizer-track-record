"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Calendar,
  BarChart3,
  ListTodo,
  TrendingUp,
  Cpu,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ShowcaseTab = "tasks" | "weekly" | "ai" | "analytics";

interface SampleTask {
  id: string;
  title: string;
  time: string;
  action: string;
  completed: boolean;
}

const INITIAL_TASKS: SampleTask[] = [
  {
    id: "1",
    title: "Implement SHA-256 refresh token rotation & cookie middleware",
    time: "09:30 AM",
    action: "Security Core",
    completed: true,
  },
  {
    id: "2",
    title: "Configure LangChain fallback between Gemini 2.5 & Groq LLaMA",
    time: "11:45 AM",
    action: "AI Pipeline",
    completed: true,
  },
  {
    id: "3",
    title: "Audit SVG math calculations for 14-day productivity trend",
    time: "02:15 PM",
    action: "Performance",
    completed: false,
  },
  {
    id: "4",
    title: "Weekly sprint retrospective & capacity allocation review",
    time: "04:30 PM",
    action: "Planning",
    completed: false,
  },
];

const WEEKLY_DAYS = [
  { day: "MON", date: "Oct 12", tasks: 4, completed: 4 },
  { day: "TUE", date: "Oct 13", tasks: 5, completed: 4, active: true },
  { day: "WED", date: "Oct 14", tasks: 4, completed: 2 },
  { day: "THU", date: "Oct 15", tasks: 3, completed: 0 },
  { day: "FRI", date: "Oct 16", tasks: 4, completed: 0 },
  { day: "SAT", date: "Oct 17", tasks: 2, completed: 0 },
  { day: "SUN", date: "Oct 18", tasks: 1, completed: 0 },
];

const WEEKLY_SAMPLE_TASKS = [
  {
    title: "System Architecture Redesign",
    priority: "HIGH",
    category: "Career",
    duration: 120,
    completed: true,
  },
  {
    title: "Deep Work: RTK Query Cache Invalidation",
    priority: "HIGH",
    category: "Career",
    duration: 90,
    completed: true,
  },
  {
    title: "5km Endurance Run & Recovery",
    priority: "MEDIUM",
    category: "Fitness",
    duration: 60,
    completed: true,
  },
  {
    title: "Distributed Systems Chapter 4 Study",
    priority: "MEDIUM",
    category: "Study",
    duration: 60,
    completed: true,
  },
  {
    title: "Refactor Database Indexes & Prisma Query Plan",
    priority: "LOW",
    category: "Career",
    duration: 45,
    completed: false,
  },
];

export function HomeShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("tasks");
  const [interactiveTasks, setInteractiveTasks] = useState<SampleTask[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setInteractiveTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = interactiveTasks.filter((t) => t.completed).length;
  const totalCount = interactiveTasks.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <section id="showcase" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 mb-3">
            <Cpu className="h-3.5 w-3.5 text-violet-400" />
            <span>Interactive Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Designed for Speed, Focus & Continuous Growth
          </h2>
          <p className="mt-4 text-base text-white/60">
            Explore the four interconnected engines of Task Optimizer. Click tabs and interact with
            live components to preview the daily workflow.
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border border-white/10 bg-[#0e0e17]/80 backdrop-blur-xl max-w-2xl">
            <button
              onClick={() => setActiveTab("tasks")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all",
                activeTab === "tasks"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <ListTodo className="h-3.5 w-3.5" />
              <span>Daily Tasks</span>
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all",
                activeTab === "weekly"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Weekly Sprints</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all",
                activeTab === "ai"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Coach {`"My Story"`}</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all",
                activeTab === "analytics"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Visual Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab Showcase Card */}
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0f0f18]/90 backdrop-blur-2xl p-4 sm:p-7 shadow-2xl shadow-violet-950/20">
          <AnimatePresence mode="wait">
            {/* 1. DAILY TASKS TAB */}
            {activeTab === "tasks" && (
              <motion.div
                key="tab-tasks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{"Today's Execution Board"}</h3>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        Interactive Demo
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Click any task to toggle status and watch optimistic updates recalculate progress.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-white/40 block">Progress</span>
                      <span className="text-sm font-bold text-violet-400">{completionPercent}%</span>
                    </div>
                    <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-emerald-400"
                        initial={false}
                        animate={{ width: `${completionPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  {interactiveTasks.map((task) => (
                    <button
                      type="button"
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group cursor-pointer",
                        task.completed
                          ? "bg-white/[0.02] border-white/5 opacity-75"
                          : "bg-white/[0.05] border-white/10 hover:border-violet-500/40 hover:bg-white/[0.08]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="shrink-0 text-violet-400">
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/20" />
                          ) : (
                            <Circle className="h-5 w-5 text-white/30 group-hover:text-violet-400" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs sm:text-sm font-medium transition-colors truncate",
                            task.completed
                              ? "text-white/40 line-through"
                              : "text-white group-hover:text-violet-200"
                          )}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/40 bg-white/5 px-2 py-0.5 rounded-md">
                          <Clock className="h-3 w-3 text-white/30" />
                          {task.time}
                        </span>
                        <span className="text-[10px] font-semibold tracking-wide text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                          {task.action}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 text-xs text-violet-300/80 flex items-center justify-between">
                  <span>✨ {completedCount} of {totalCount} completed for today&apos;s sprint</span>
                  <span className="text-white/40 text-[11px]">Backed by RTK Query with instant rollback</span>
                </div>
              </motion.div>
            )}

            {/* 2. WEEKLY SPRINTS TAB */}
            {activeTab === "weekly" && (
              <motion.div
                key="tab-weekly"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white">7-Day Sprint Planner</h3>
                    <p className="text-xs text-white/50 mt-1">
                      Monday-anchored capacity planning with priority tiers and duration weighting.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-white/40 block">Week Sprint</span>
                    <span className="text-sm font-bold text-emerald-400">14 / 18 (78%)</span>
                  </div>
                </div>

                {/* Day Strip */}
                <div className="grid grid-cols-7 gap-2">
                  {WEEKLY_DAYS.map((d) => (
                    <div
                      key={d.day}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all",
                        d.active
                          ? "bg-violet-600/20 border-violet-500 shadow-md shadow-violet-900/30"
                          : "bg-white/[0.03] border-white/5 opacity-70"
                      )}
                    >
                      <span className="text-[11px] font-bold text-white/90 block">{d.day}</span>
                      <span className="text-[9px] text-white/40 block">{d.date}</span>
                      <div className="mt-1.5 text-[10px] font-semibold text-violet-300">
                        {d.completed}/{d.tasks}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Task Breakdown for Active Day */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white/70 block">
                    Tuesday Schedule (Capacity: 375 min)
                  </span>
                  {WEEKLY_SAMPLE_TASKS.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4 shrink-0",
                            item.completed ? "text-emerald-400" : "text-white/20"
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium",
                            item.completed ? "text-white/50 line-through" : "text-white"
                          )}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            item.priority === "HIGH"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : item.priority === "MEDIUM"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                          )}
                        >
                          {item.priority}
                        </span>
                        <span className="text-white/40 text-[11px]">{item.duration}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. AI COACH TAB */}
            {activeTab === "ai" && (
              <motion.div
                key="tab-ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">Daily AI Retrospective</h3>
                      <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300 border border-violet-500/30">
                        {`"My Story" Engine`}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Multi-provider LangChain generation (Gemini 2.5 Flash + Groq LLaMA 3.3).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                    <Award className="h-4 w-4" />
                    <span>Score: 92 / 100</span>
                  </div>
                </div>

                {/* Score and Summary Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col items-center justify-center text-center">
                    {/* SVG Radial Score Ring */}
                    <div className="relative w-24 h-24 mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset="20.09"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white">92</span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
                          Mastery
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/60">{"Tier: Emerald (≥ 75)"}</p>
                  </div>

                  <div className="sm:col-span-2 rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white/70 block mb-1">
                        Executive AI Synthesis
                      </span>
                      <p className="text-xs text-white/80 leading-relaxed">
                        {`"High cognitive execution across 4 major technical workstreams today. All security architecture and multi-model fallbacks were completed ahead of time. Context switches remained below threshold."`}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-xs font-semibold text-violet-300 block mb-1 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                        Next-Day Coach Recommendation
                      </span>
                      <p className="text-xs text-white/60">
                        {`"Shift asynchronous PR reviews to 10:30 AM to safeguard your uninterrupted deep coding block in the early afternoon."`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-white/40 flex items-center justify-between px-1">
                  <span>Protected by two-step verification (Preview → Save)</span>
                  <span>Timezone: UTC+5:30 (IST Aware)</span>
                </div>
              </motion.div>
            )}

            {/* 4. VISUAL ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <motion.div
                key="tab-analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Mathematical SVG Analytics</h3>
                    <p className="text-xs text-white/50 mt-1">
                      Pure SVG coordinate calculations with zero external chart library overhead.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    <span>+8 pt Trend</span>
                  </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] text-white/40 block">Latest Score</span>
                    <span className="text-xl font-bold text-emerald-400">92</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] text-white/40 block">14-Day Average</span>
                    <span className="text-xl font-bold text-violet-400">86</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] text-white/40 block">Personal Best</span>
                    <span className="text-xl font-bold text-amber-400">98</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] text-white/40 block">Completion</span>
                    <span className="text-xl font-bold text-white">91%</span>
                  </div>
                </div>

                {/* Custom SVG Trend Curve */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                    <span>Productivity Trajectory (Last 8 Sessions)</span>
                    <span>100 Max Score</span>
                  </div>

                  <div className="w-full h-36">
                    <svg
                      viewBox="0 0 700 160"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="140" x2="700" y2="140" stroke="rgba(255,255,255,0.05)" />

                      {/* Area Fill */}
                      <path
                        d="M 50 120 C 130 110, 180 80, 240 75 C 310 70, 360 90, 430 65 C 500 45, 570 55, 650 30 L 650 140 L 50 140 Z"
                        fill="url(#areaGradient)"
                      />

                      {/* Main Trend Line */}
                      <path
                        d="M 50 120 C 130 110, 180 80, 240 75 C 310 70, 360 90, 430 65 C 500 45, 570 55, 650 30"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Data dots */}
                      {[
                        { cx: 50, cy: 120, label: "72" },
                        { cx: 140, cy: 95, label: "78" },
                        { cx: 240, cy: 75, label: "84" },
                        { cx: 335, cy: 82, label: "81" },
                        { cx: 430, cy: 65, label: "88" },
                        { cx: 540, cy: 52, label: "89" },
                        { cx: 650, cy: 30, label: "92" },
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.cx} cy={pt.cy} r="5" fill="#0a0a0f" stroke="#34d399" strokeWidth="2.5" />
                          <text
                            x={pt.cx}
                            y={pt.cy - 10}
                            fill="#ffffff"
                            fontSize="11"
                            textAnchor="middle"
                            fontWeight="600"
                          >
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
