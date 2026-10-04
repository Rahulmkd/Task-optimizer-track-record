"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Map,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/constants";

/* -------------------------------------------------------------------------- */
/*                                FORM DATA                                   */
/* -------------------------------------------------------------------------- */

const roles = [
  "Software Developer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Engineer",
];

const ctcOptions = ["5 LPA", "7 LPA", "10 LPA", "12 LPA", "15 LPA", "20+ LPA"];

const durations = [
  "1 Month",
  "2 Months",
  "3 Months",
  "4 Months",
  "6 Months",
  "12 Months",
];

const programmingLanguages = [
  "C++",
  "JavaScript",
  "TypeScript",
  "Java",
  "Python",
  "Go",
];

const developmentSkills = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Docker",
];

const focusAreas = [
  "DSA",
  "Backend",
  "Frontend",
  "DBMS",
  "Operating System",
  "Computer Networks",
  "System Design",
  "Interview Prep",
];

const dsaLevels = ["Beginner", "Intermediate", "Advanced"];

const hoursOptions = ["1 Hour", "2 Hours", "3 Hours", "4 Hours", "5+ Hours"];

const daysOptions = ["3 Days", "4 Days", "5 Days", "6 Days", "7 Days"];

const learningStyles = ["Videos", "Articles", "Practice", "Mix"];

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

/* -------------------------------------------------------------------------- */
/*                              SELECT FIELD                                  */
/* -------------------------------------------------------------------------- */

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-zinc-400">{label}</label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            h-10
            w-full
            appearance-none
            rounded-lg
            border
            border-white/[0.08]
            bg-zinc-950
            px-3
            pr-9
            text-sm
            text-zinc-200
            outline-none
            transition
            focus:border-violet-500/50
            focus:ring-2
            focus:ring-violet-500/10
          "
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-zinc-500
          "
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    CHIP                                    */
/* -------------------------------------------------------------------------- */

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-lg
        border
        px-3
        py-2
        text-xs
        font-medium
        transition-all
        duration-200
        ${
          selected
            ? "border-violet-500/60 bg-violet-500/10 text-violet-300"
            : "border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-zinc-200"
        }
      `}
    >
      {selected && <Check className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION HEADER                                */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-violet-500/10
          text-violet-400
        "
      >
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>

        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ROOT COMPONENT                                */
/* -------------------------------------------------------------------------- */

export function Roadmapsh() {
  /* ------------------------------------------------------------------------ */
  /* Form State                                                               */
  /* ------------------------------------------------------------------------ */

  const router = useRouter();

  const [role, setRole] = useState(roles[0]);
  const [ctc, setCtc] = useState(ctcOptions[2]);
  const [duration, setDuration] = useState(durations[2]);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "JavaScript",
    "TypeScript",
  ]);

  const [selectedDevelopment, setSelectedDevelopment] = useState<string[]>([
    "Node.js",
    "MongoDB",
  ]);

  const [dsaLevel, setDsaLevel] = useState("Intermediate");

  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([
    "DSA",
    "Backend",
    "DBMS",
    "Interview Prep",
  ]);

  const [hoursPerDay, setHoursPerDay] = useState("3 Hours");
  const [daysPerWeek, setDaysPerWeek] = useState("5 Days");
  const [learningStyle, setLearningStyle] = useState("Practice");

  const [isGenerated, setIsGenerated] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  const toggleItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const handleGenerate = () => {
    setIsGenerated(true);

    toast.success("Generated your roadmap");

    router.push(ROUTES.ROADMAP);
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="w-full space-y-5 pb-10"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.06]
          bg-zinc-900/50
          p-5
          sm:p-6
        "
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
            <Map className="h-5 w-5 text-violet-400" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
              Roadmap Builder
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-white">
              Create Your Roadmap
            </h1>

            <p className="mt-1 text-xs text-zinc-500">
              Choose your goal, skills and available time.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 01 — GOAL                                                          */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="
          rounded-2xl
          border
          border-white/[0.06]
          bg-zinc-900/50
          p-5
        "
      >
        <SectionHeader
          icon={Target}
          title="Your Goal"
          description="Tell us what you want to achieve."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="Target Role"
            value={role}
            options={roles}
            onChange={setRole}
          />

          <SelectField
            label="Target CTC"
            value={ctc}
            options={ctcOptions}
            onChange={setCtc}
          />

          <SelectField
            label="Roadmap Duration"
            value={duration}
            options={durations}
            onChange={setDuration}
          />
        </div>
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* 02 — SKILLS                                                        */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="
          rounded-2xl
          border
          border-white/[0.06]
          bg-zinc-900/50
          p-5
        "
      >
        <SectionHeader
          icon={Code2}
          title="Your Skills"
          description="Select what you already know."
        />

        {/* Programming */}

        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-400">Programming</p>

          <div className="flex flex-wrap gap-2">
            {programmingLanguages.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={selectedLanguages.includes(item)}
                onClick={() => toggleItem(item, setSelectedLanguages)}
              />
            ))}
          </div>
        </div>

        {/* Development */}

        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium text-zinc-400">Development</p>

          <div className="flex flex-wrap gap-2">
            {developmentSkills.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={selectedDevelopment.includes(item)}
                onClick={() => toggleItem(item, setSelectedDevelopment)}
              />
            ))}
          </div>
        </div>

        {/* DSA */}

        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium text-zinc-400">DSA Level</p>

          <div className="flex flex-wrap gap-2">
            {dsaLevels.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={dsaLevel === item}
                onClick={() => setDsaLevel(item)}
              />
            ))}
          </div>
        </div>

        {/* Focus Areas */}

        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium text-zinc-400">Focus Areas</p>

          <div className="flex flex-wrap gap-2">
            {focusAreas.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={selectedFocusAreas.includes(item)}
                onClick={() => toggleItem(item, setSelectedFocusAreas)}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* 03 — SCHEDULE                                                      */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="
          rounded-2xl
          border
          border-white/[0.06]
          bg-zinc-900/50
          p-5
        "
      >
        <SectionHeader
          icon={Clock3}
          title="Your Schedule"
          description="Set a realistic study routine."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {/* Hours */}

          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Hours per day
            </label>

            <div className="flex flex-wrap gap-2">
              {hoursOptions.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={hoursPerDay === item}
                  onClick={() => setHoursPerDay(item)}
                />
              ))}
            </div>
          </div>

          {/* Days */}

          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Days per week
            </label>

            <div className="flex flex-wrap gap-2">
              {daysOptions.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={daysPerWeek === item}
                  onClick={() => setDaysPerWeek(item)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Learning Style */}

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-zinc-400">
            Learning Style
          </label>

          <div className="flex flex-wrap gap-2">
            {learningStyles.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={learningStyle === item}
                onClick={() => setLearningStyle(item)}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* SUMMARY                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          rounded-xl
          border
          border-white/[0.06]
          bg-zinc-900/40
          p-4
        "
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-400">{role}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-300">{ctc}</span>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-400">{duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-400">
              {hoursPerDay} · {daysPerWeek}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-400">
              {selectedFocusAreas.length} focus areas
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* GENERATE                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col items-center gap-2 pt-1">
        <motion.button
          type="button"
          onClick={handleGenerate}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="
            group
            flex
            w-full
            max-w-sm
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-violet-600
            px-6
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-violet-500/20
            transition-all
            duration-300
            hover:bg-violet-500
          "
        >
          <Sparkles className="h-4 w-4" />

          {isGenerated ? "Roadmap Generated!" : "Generate My Roadmap"}

          {!isGenerated && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </motion.button>

        <p className="text-[11px] text-zinc-600">
          Your selections will be used to build your personalized roadmap.
        </p>
      </div>
    </motion.div>
  );
}
