"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Backdrop } from "@/components/ui/Backdrop";
import { ModalPanel } from "@/components/ui/ModalPanel";
import { Button } from "@/components/ui/button";
import {
  AITaskItem,
  AIWeeklyPlanPreview,
  WeekDay,
} from "@/features/schedule/types/weekly.types";
import {
  useBulkSaveWeeklyTasksMutation,
  useGenerateAIWeeklyPlanMutation,
} from "@/features/schedule/services/weekly.service";
import {
  getDurationLabel,
  PRIORITY_CONFIG,
} from "../utils/weekly-schedule.utils";
import { cn } from "@/lib/utils";

interface AIWeeklyPlanModalProps {
  weekStart: string;
  onClose: () => void;
  onPlanApproved?: () => void;
}

const PRESETS = [
  {
    label: "🚀 SDE + DSA Grind",
    context:
      "Wake up around 6:00 AM. Practice DSA & LeetCode problems from 6:30 AM to 8:30 AM. Full-time Software Engineer job from 9:00 AM to 6:00 PM. Hit the gym from 6:30 PM to 8:15 PM. Dinner, personal wind-down, and tech reading 9:00 PM to 11:00 PM. Sleep at 11:00 PM. Weekends: Saturday morning coding contest and side projects; Sunday rest, meal prep, and weekly review.",
    instructions:
      "Prioritize DSA Medium/Hard problems and System Design. Ensure at least 7 hours of sleep every night.",
  },
  {
    label: "📚 Student & Exam Prep",
    context:
      "Wake up at 6:30 AM. Morning revision & high-focus study from 7:00 AM to 9:30 AM. College lectures and labs from 10:00 AM to 4:00 PM. Evening cardio / sports 5:00 PM to 6:15 PM. Practice problems, coursework, and assignment prep from 7:30 PM to 10:30 PM. Bedtime at 11:00 PM. Weekends: Saturday mock tests, Sunday light study and relaxation.",
    instructions:
      "Incorporate active recall and spaced repetition in study blocks. Keep Saturday afternoon open for hobbies.",
  },
  {
    label: "⚡ Remote Worker & Fitness",
    context:
      "Wake up at 6:30 AM. Morning workout and functional training 7:00 AM to 8:15 AM. Remote tech job 9:00 AM to 5:30 PM. Professional upskilling / certifications from 6:30 PM to 8:00 PM. Dinner, family time, and relaxation 8:30 PM to 10:30 PM. Bedtime at 11:00 PM. Weekends: Outdoor activities on Saturday, personal planning on Sunday.",
    instructions:
      "Include a dedicated 45-minute daily walk or stretch break. Limit screen time before bed.",
  },
];

export function AIWeeklyPlanModal({
  weekStart,
  onClose,
  onPlanApproved,
}: AIWeeklyPlanModalProps) {
  const [step, setStep] = useState<"input" | "preview">("input");
  const [routineContext, setRoutineContext] = useState("");
  const [instructions, setInstructions] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(true);

  // Preview state (allows editing before approving)
  const [previewPlan, setPreviewPlan] = useState<AIWeeklyPlanPreview | null>(
    null,
  );
  const [activePreviewTab, setActivePreviewTab] = useState<
    "structured" | "weekdays" | "saturday" | "sunday" | "all"
  >("structured");

  // Editing individual tasks in preview
  const [editableTasks, setEditableTasks] = useState<
    (AITaskItem & { day: WeekDay; id: string })[]
  >([]);

  const [
    generateAIWeeklyPlan,
    { isLoading: isGenerating, isError: isGenError, error: genError },
  ] = useGenerateAIWeeklyPlanMutation();

  const [bulkSaveWeeklyTasks, { isLoading: isSaving }] =
    useBulkSaveWeeklyTasksMutation();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setRoutineContext(preset.context);
    setInstructions(preset.instructions);
  };

  const handleGenerate = async () => {
    if (!routineContext.trim() || routineContext.trim().length < 10) {
      toast.error("Please describe your routine (at least 10 characters).");
      return;
    }

    try {
      const result = await generateAIWeeklyPlan({
        routineContext: routineContext.trim(),
        instructions: instructions.trim() || undefined,
        weekStart,
      }).unwrap();

      setPreviewPlan(result);

      // Create unique temporary IDs for editable tasks
      const indexedTasks = result.expandedTasks.map((t, index) => ({
        ...t,
        id: `ai-temp-${index}-${t.day}-${t.startTime.replace(/\s+/g, "")}`,
      }));
      setEditableTasks(indexedTasks);
      setStep("preview");
      toast.success("AI Weekly Schedule generated! Review before saving.");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to generate weekly schedule. Please try again.";
      toast.error(msg);
    }
  };

  const handleRemoveTask = (taskId: string) => {
    setEditableTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.info("Task removed from preview.");
  };

  const handleApproveAndSave = async () => {
    if (!editableTasks.length) {
      toast.error("No tasks to save. Please regenerate or add tasks.");
      return;
    }

    try {
      await bulkSaveWeeklyTasks({
        weekStart,
        replaceExisting,
        tasks: editableTasks.map((t) => ({
          title: t.title,
          description: t.description ?? null,
          day: t.day,
          priority: t.priority,
          category: t.category,
          duration: t.duration,
          startTime: t.startTime,
          repeatWeekly: t.repeatWeekly,
          completed: false,
        })),
      }).unwrap();

      toast.success(
        `Weekly schedule successfully saved with ${editableTasks.length} tasks!`,
      );
      onPlanApproved?.();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to save weekly schedule. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel className="w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden bg-[#0c0d14] border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.12)] rounded-2xl">
        {/* ── Top Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-violet-950/30 via-transparent to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Sparkles className="h-4.5 w-4.5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  AI Weekly Plan Generator
                </h2>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Intelligent Timetable
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                {step === "input"
                  ? "Describe your routine, working hours, and goals to generate an optimized weekly timetable."
                  : "Review, adjust, and approve your AI-generated weekly schedule before saving."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Modal Body (Scrollable) ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {step === "input" ? (
            /* ───────────────────────────────────────────────────────────── */
            /*                      STEP 1: CONTEXT INPUT                    */
            /* ───────────────────────────────────────────────────────────── */
            <div className="space-y-5">
              {/* Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Quick Preset Templates
                  </span>
                  <span className="text-[11px] text-violet-400/80">
                    Click to pre-fill prompt
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-violet-500/40 transition-all group"
                    >
                      <p className="text-xs font-semibold text-white/90 group-hover:text-violet-300 transition-colors">
                        {p.label}
                      </p>
                      <p className="text-[11px] text-white/40 line-clamp-2 mt-1">
                        {p.context}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="routineContext"
                  className="block text-xs font-semibold text-white/75"
                >
                  Your Daily Routine, Lifestyle & Goals{" "}
                  <span className="text-violet-400">*</span>
                </label>
                <textarea
                  id="routineContext"
                  rows={5}
                  value={routineContext}
                  onChange={(e) => setRoutineContext(e.target.value)}
                  placeholder="e.g. Wake up 6:00 AM. Practice DSA 6:30-8:30 AM. Job hours 9:00 AM-6:00 PM. Gym 6:30-8:00 PM. Evening study and dinner 8:30-10:30 PM. Sleep 11:00 PM. Saturday side projects, Sunday weekly review & recovery."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-3 text-sm text-white placeholder-white/30 focus:border-violet-500/60 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all resize-y"
                />
                <p className="text-[11px] text-white/40">
                  Include wake up/sleep timings, job or college hours, DSA or
                  study priorities, gym sessions, and commitments.
                </p>
              </div>

              {/* Instructions Textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="instructions"
                  className="block text-xs font-semibold text-white/75"
                >
                  Additional Constraints & Instructions{" "}
                  <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="instructions"
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Keep Saturday evening free for social time; include a 30-min walk; ensure 7 hours of sleep every night."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-3 text-sm text-white placeholder-white/30 focus:border-violet-500/60 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all resize-y"
                />
              </div>

              {/* Options */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-xs font-semibold text-white/80">
                    Replace existing tasks this week
                  </p>
                  <p className="text-[11px] text-white/40">
                    If checked, overwrites prior tasks for week of {weekStart}{" "}
                    to prevent duplicates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/40"
                />
              </div>

              {/* Error banner if generation fails */}
              {isGenError && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <p className="font-semibold">Generation failed</p>
                    <p className="text-red-200/70 mt-0.5">
                      {(genError as { data?: { message?: string } })?.data
                        ?.message ||
                        "Could not generate schedule. Please refine your inputs and try again."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ───────────────────────────────────────────────────────────── */
            /*                     STEP 2: PREVIEW & APPROVE                 */
            /* ───────────────────────────────────────────────────────────── */
            <div className="space-y-5">
              {/* Summary and Study Rotation Banner */}
              {previewPlan && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold">
                      <Sparkles className="h-3.5 w-3.5" />
                      Plan Strategy Overview
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {previewPlan.summary}
                    </p>
                  </div>

                  {previewPlan.studyRotation && (
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <BookOpen className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-300">
                          Study & Topic Rotation
                        </p>
                        <p className="text-xs text-white/70 leading-relaxed mt-0.5">
                          {previewPlan.studyRotation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation View Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("structured")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0",
                    activePreviewTab === "structured"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5",
                  )}
                >
                  Structured Timetable
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("weekdays")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0",
                    activePreviewTab === "weekdays"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5",
                  )}
                >
                  Monday–Friday ({previewPlan?.weekdaySchedule.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("saturday")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0",
                    activePreviewTab === "saturday"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5",
                  )}
                >
                  Saturday ({previewPlan?.saturdaySchedule.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("sunday")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0",
                    activePreviewTab === "sunday"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5",
                  )}
                >
                  Sunday ({previewPlan?.sundaySchedule.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0",
                    activePreviewTab === "all"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5",
                  )}
                >
                  All 7 Days ({editableTasks.length} tasks)
                </button>
              </div>

              {/* ── TAB 1: Structured Timetable (Monday-Friday, Saturday, Sunday) ── */}
              {activePreviewTab === "structured" && previewPlan && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Monday-Friday Section */}
                  <div className="space-y-2.5 rounded-xl bg-white/[0.02] border border-white/5 p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-semibold text-violet-300">
                        Monday – Friday
                      </span>
                      <span className="text-[10px] text-white/40">
                        Daily routine
                      </span>
                    </div>
                    <div className="space-y-2">
                      {previewPlan.weekdaySchedule.map((item, idx) => (
                        <div
                          key={`wd-${idx}`}
                          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] text-violet-400 font-mono">
                            <span>
                              {item.startTime} – {item.endTime}
                            </span>
                            <span className="text-[10px] text-white/40 font-sans">
                              {getDurationLabel(item.duration)}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-white mt-1">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">
                              {item.category}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border",
                                PRIORITY_CONFIG[item.priority]?.badge,
                              )}
                            >
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Saturday Section */}
                  <div className="space-y-2.5 rounded-xl bg-white/[0.02] border border-white/5 p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-semibold text-amber-300">
                        Saturday
                      </span>
                      <span className="text-[10px] text-white/40">
                        Deep work & leisure
                      </span>
                    </div>
                    <div className="space-y-2">
                      {previewPlan.saturdaySchedule.map((item, idx) => (
                        <div
                          key={`sat-${idx}`}
                          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono">
                            <span>
                              {item.startTime} – {item.endTime}
                            </span>
                            <span className="text-[10px] text-white/40 font-sans">
                              {getDurationLabel(item.duration)}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-white mt-1">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">
                              {item.category}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border",
                                PRIORITY_CONFIG[item.priority]?.badge,
                              )}
                            >
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sunday Section */}
                  <div className="space-y-2.5 rounded-xl bg-white/[0.02] border border-white/5 p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-semibold text-emerald-300">
                        Sunday
                      </span>
                      <span className="text-[10px] text-white/40">
                        Review & reset
                      </span>
                    </div>
                    <div className="space-y-2">
                      {previewPlan.sundaySchedule.map((item, idx) => (
                        <div
                          key={`sun-${idx}`}
                          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                            <span>
                              {item.startTime} – {item.endTime}
                            </span>
                            <span className="text-[10px] text-white/40 font-sans">
                              {getDurationLabel(item.duration)}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-white mt-1">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">
                              {item.category}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border",
                                PRIORITY_CONFIG[item.priority]?.badge,
                              )}
                            >
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: Weekday List ─────────────────────────── */}
              {activePreviewTab === "weekdays" && previewPlan && (
                <div className="space-y-2">
                  {previewPlan.weekdaySchedule.map((task, idx) => (
                    <div
                      key={`wd-row-${idx}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-mono text-violet-400 min-w-[130px]">
                          {task.startTime} – {task.endTime}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-white/40">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {task.category}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded border",
                            PRIORITY_CONFIG[task.priority]?.badge,
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 3: Saturday List ─────────────────────────── */}
              {activePreviewTab === "saturday" && previewPlan && (
                <div className="space-y-2">
                  {previewPlan.saturdaySchedule.map((task, idx) => (
                    <div
                      key={`sat-row-${idx}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-mono text-amber-400 min-w-[130px]">
                          {task.startTime} – {task.endTime}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-white/40">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {task.category}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded border",
                            PRIORITY_CONFIG[task.priority]?.badge,
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 4: Sunday List ─────────────────────────── */}
              {activePreviewTab === "sunday" && previewPlan && (
                <div className="space-y-2">
                  {previewPlan.sundaySchedule.map((task, idx) => (
                    <div
                      key={`sun-row-${idx}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-mono text-emerald-400 min-w-[130px]">
                          {task.startTime} – {task.endTime}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-white/40">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {task.category}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded border",
                            PRIORITY_CONFIG[task.priority]?.badge,
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 5: All 7 Days Detailed List (With Remove Action) ── */}
              {activePreviewTab === "all" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-white/50 px-1">
                    <span>
                      {editableTasks.length} tasks scheduled across Monday
                      through Sunday
                    </span>
                    <span>Click trash icon to remove individual tasks</span>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {editableTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold px-2 py-1 rounded bg-violet-500/20 text-violet-300 min-w-[44px] text-center">
                            {task.day}
                          </span>
                          <div className="text-xs font-mono text-white/60 min-w-[130px]">
                            {task.startTime} – {task.endTime}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-white">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[11px] text-white/40 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">
                            {task.category}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded border",
                              PRIORITY_CONFIG[task.priority]?.badge,
                            )}
                          >
                            {task.priority}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(task.id)}
                            title="Remove task"
                            className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Modal Footer ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-white/10 bg-[#0a0a0f] shrink-0">
          {step === "input" ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isGenerating || !routineContext.trim()}
                onClick={handleGenerate}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-5 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Analyzing & Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Schedule</span>
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("input")}
                  className="text-white/60 hover:text-white text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Edit Context
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="text-white/70 hover:text-white border-white/10 hover:bg-white/5 text-xs flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={cn(
                      "h-3.5 w-3.5",
                      isGenerating && "animate-spin",
                    )}
                  />
                  Regenerate
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-white/60 hover:text-white text-xs"
                >
                  Discard
                </Button>

                <Button
                  type="button"
                  disabled={isSaving || !editableTasks.length}
                  onClick={handleApproveAndSave}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-5 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Approve & Save Plan</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </ModalPanel>
    </Backdrop>
  );
}
