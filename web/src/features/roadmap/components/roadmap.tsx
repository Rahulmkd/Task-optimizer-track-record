// "use client";

// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   CalendarDays,
//   Map,
//   Rocket,
//   Target,
//   Zap,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// /* -------------------------------------------------------------------------- */
// /*                              ROADMAP DATA                                  */
// /* -------------------------------------------------------------------------- */

// const roadmapData = [
//   {
//     id: "2-month",
//     title: "2 Month",
//     subtitle: "SDE Roadmap",
//     description:
//       "An intensive roadmap focused on interview preparation, DSA, core CS and backend fundamentals.",
//     duration: "8 Weeks",
//     icon: Zap,
//     color: "text-orange-400",
//     bg: "bg-orange-500/10",
//     border: "border-orange-500/20",
//     href: "/roadmap/2-month",
//   },
//   {
//     id: "3-month",
//     title: "3 Month",
//     subtitle: "SDE Roadmap",
//     description:
//       "A balanced roadmap covering DSA, CS fundamentals, development and interview preparation.",
//     duration: "12 Weeks",
//     icon: Target,
//     color: "text-violet-400",
//     bg: "bg-violet-500/10",
//     border: "border-violet-500/20",
//     href: "/roadmap/3-month",
//   },
//   {
//     id: "6-month",
//     title: "6 Month",
//     subtitle: "SDE Roadmap",
//     description:
//       "A complete long-term roadmap to build strong DSA, development, system design and interview skills.",
//     duration: "24 Weeks",
//     icon: Rocket,
//     color: "text-blue-400",
//     bg: "bg-blue-500/10",
//     border: "border-blue-500/20",
//     href: "/roadmap/6-month",
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /*                              ROADMAP CARD                                  */
// /* -------------------------------------------------------------------------- */

// export function RoadmapCard({
//   title,
//   subtitle,
//   description,
//   duration,
//   icon: Icon,
//   color,
//   bg,
//   border,
//   href,
// }: (typeof roadmapData)[number]) {
//   const router = useRouter();

//   return (
//     <motion.button
//       type="button"
//       onClick={() => router.push(href)}
//       whileHover={{
//         y: -5,
//       }}
//       whileTap={{
//         scale: 0.98,
//       }}
//       transition={{
//         duration: 0.2,
//       }}
//       className={`
//         group
//         relative
//         w-full
//         overflow-hidden
//         rounded-2xl
//         border
//         ${border}
//         bg-zinc-900/70
//         p-5
//         text-left
//         transition-all
//         duration-300
//         hover:bg-zinc-900
//         hover:shadow-xl
//         focus:outline-none
//         focus:ring-2
//         focus:ring-violet-500/30
//       `}
//     >
//       {/* Decorative background */}

//       <div
//         className={`
//           pointer-events-none
//           absolute
//           -right-10
//           -top-10
//           h-28
//           w-28
//           rounded-full
//           ${bg}
//           opacity-40
//           blur-2xl
//           transition-all
//           duration-500
//           group-hover:scale-150
//         `}
//       />

//       {/* Header */}

//       <div className="relative flex items-start justify-between">
//         <div
//           className={`
//             flex
//             h-11
//             w-11
//             items-center
//             justify-center
//             rounded-xl
//             ${bg}
//           `}
//         >
//           <Icon className={`h-5 w-5 ${color}`} />
//         </div>

//         <div
//           className="
//             flex
//             h-8
//             w-8
//             items-center
//             justify-center
//             rounded-full
//             bg-white/[0.04]
//             transition-all
//             duration-300
//             group-hover:bg-white/[0.08]
//           "
//         >
//           <ArrowRight
//             className="
//               h-4
//               w-4
//               text-zinc-500
//               transition-transform
//               duration-300
//               group-hover:translate-x-1
//               group-hover:text-zinc-200
//             "
//           />
//         </div>
//       </div>

//       {/* Title */}

//       <div className="relative mt-5">
//         <h3 className="text-xl font-black tracking-tight text-white">
//           {title}
//         </h3>

//         <p className={`mt-1 text-sm font-semibold ${color}`}>{subtitle}</p>
//       </div>

//       {/* Description */}

//       <p className="relative mt-3 min-h-[48px] text-sm leading-6 text-zinc-400">
//         {description}
//       </p>

//       {/* Duration */}

//       <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
//         <div className="flex items-center gap-2 text-xs text-zinc-500">
//           <CalendarDays className="h-4 w-4" />

//           <span>{duration}</span>
//         </div>

//         <span
//           className="
//             text-xs
//             font-semibold
//             text-zinc-500
//             transition-colors
//             duration-300
//             group-hover:text-zinc-200
//           "
//         >
//           View roadmap
//         </span>
//       </div>
//     </motion.button>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*                              ROOT EXPORT                                   */
// /* -------------------------------------------------------------------------- */

// export function Roadmapsh() {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: 12,
//       }}
//       animate={{
//         opacity: 1,
//         y: 0,
//       }}
//       transition={{
//         duration: 0.38,
//         ease: "easeOut",
//       }}
//       className="space-y-6"
//     >
//       {/* ------------------------------------------------------------------ */}
//       {/* Header                                                             */}
//       {/* ------------------------------------------------------------------ */}

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <div className="mb-2 flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
//               <Map className="h-4 w-4 text-violet-400" />
//             </div>

//             <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
//               SDE Roadmaps
//             </span>
//           </div>

//           <h1 className="text-2xl font-black tracking-tight text-white">
//             Choose your roadmap
//           </h1>

//           <p className="mt-1 max-w-xl text-sm text-zinc-500">
//             Select a roadmap based on the amount of time you have available for
//             your SDE preparation.
//           </p>
//         </div>
//       </div>

//       {/* ------------------------------------------------------------------ */}
//       {/* Roadmap Cards                                                      */}
//       {/* ------------------------------------------------------------------ */}

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         {roadmapData.map((roadmap, index) => (
//           <motion.div
//             key={roadmap.id}
//             initial={{
//               opacity: 0,
//               y: 15,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               duration: 0.3,
//               delay: index * 0.08,
//               ease: "easeOut",
//             }}
//           >
//             <RoadmapCard {...roadmap} />
//           </motion.div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Map,
  Rocket,
  Sparkles,
  Target,
  UserRound,
  WandSparkles,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                              DEMO DATA                                     */
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

const experienceLevels = [
  "Fresher",
  "0 - 1 Year",
  "1 - 2 Years",
  "2 - 4 Years",
  "4+ Years",
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

const csSkills = [
  "DBMS",
  "Operating System",
  "Computer Networks",
  "OOP",
  "System Design",
];

const dsaLevels = ["Beginner", "Intermediate", "Advanced"];

const topics = {
  DSA: [
    "Arrays",
    "Strings",
    "HashMap",
    "Two Pointer",
    "Sliding Window",
    "Linked List",
    "Stack & Queue",
    "Binary Search",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Backtracking",
  ],
  "CS Fundamentals": [
    "DBMS",
    "Operating System",
    "Computer Networks",
    "OOP",
    "Computer Architecture",
  ],
  Development: [
    "Frontend",
    "Backend",
    "REST APIs",
    "Authentication",
    "Database Design",
    "System Design",
  ],
  "Interview Prep": [
    "Resume Building",
    "HR Interview",
    "Coding Interview",
    "Mock Interviews",
    "System Design Interview",
  ],
};

const companyTypes = [
  "Product Based",
  "Service Based",
  "Startup",
  "Big Tech",
  "Any",
];

const primaryGoals = [
  "Get a Job",
  "Switch Job",
  "Increase CTC",
  "Prepare for Interviews",
  "Build Strong Fundamentals",
];

const studyTimes = ["Morning", "Afternoon", "Evening", "Night", "Flexible"];

const intensityOptions = [
  "Light (1-2 hrs/day)",
  "Balanced (2-4 hrs/day)",
  "Intensive (4-6+ hrs/day)",
];

const learningStyles = ["Videos", "Articles", "Practice", "Mix"];

/* -------------------------------------------------------------------------- */
/*                              TYPES                                         */
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
          onChange={(e) => onChange(e.target.value)}
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
/*                              CHIP                                          */
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
            ? "border-violet-500/60 bg-violet-500/10 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.08)]"
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
/*                              SECTION HEADER                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
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
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
            {number}
          </span>

          <h2 className="text-base font-bold text-white">{title}</h2>
        </div>

        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ROOT EXPORT                                   */
/* -------------------------------------------------------------------------- */

export function Roadmapsh() {
  /* ------------------------------------------------------------------------ */
  /* Form State                                                              */
  /* ------------------------------------------------------------------------ */

  const [role, setRole] = useState(roles[0]);
  const [ctc, setCtc] = useState(ctcOptions[2]);
  const [duration, setDuration] = useState(durations[2]);
  const [experience, setExperience] = useState(experienceLevels[0]);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "C++",
    "JavaScript",
  ]);

  const [selectedDevelopment, setSelectedDevelopment] = useState<string[]>([
    "Node.js",
    "MongoDB",
  ]);

  const [selectedCS, setSelectedCS] = useState<string[]>(["DBMS", "OOP"]);

  const [dsaLevel, setDsaLevel] = useState("Intermediate");

  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "Arrays",
    "Strings",
    "Linked List",
    "Trees",
    "DBMS",
    "Backend",
    "REST APIs",
    "Authentication",
    "Coding Interview",
  ]);

  const [hoursPerDay, setHoursPerDay] = useState("3 Hours");
  const [daysPerWeek, setDaysPerWeek] = useState("5 Days");
  const [studyTime, setStudyTime] = useState("Evening");

  const [companyType, setCompanyType] = useState("Product Based");
  const [primaryGoal, setPrimaryGoal] = useState("Get a Job");

  const [targetCompanies, setTargetCompanies] = useState([
    "Google",
    "Microsoft",
    "Amazon",
  ]);

  const [intensity, setIntensity] = useState("Balanced (2-4 hrs/day)");

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

  const toggleTopic = (topic: string) => {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  };

  const addCompany = () => {
    const company = window.prompt("Enter company name");

    if (
      company &&
      company.trim() &&
      !targetCompanies.includes(company.trim())
    ) {
      setTargetCompanies((current) => [...current, company.trim()]);
    }
  };

  const removeCompany = (company: string) => {
    setTargetCompanies((current) => current.filter((item) => item !== company));
  };

  const handleGenerate = () => {
    setIsGenerated(true);

    setTimeout(() => {
      setIsGenerated(false);
    }, 3000);
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        ease: "easeOut",
      }}
      className="mx-auto max-w-6xl space-y-6 pb-10"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-6">
        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <Map className="h-4 w-4 text-violet-400" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
                Roadmap Builder
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white">
              Create Your Roadmap
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Tell us your goals, current skills and available time. We&apos;ll
              use these preferences to build a personalized month-wise SDE
              roadmap for you.
            </p>
          </div>

          <div className="hidden h-28 w-44 items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-950/60 md:flex">
            <div className="relative">
              <Rocket className="h-10 w-10 text-violet-400" />

              <Sparkles className="absolute -right-4 -top-4 h-4 w-4 text-violet-300" />

              <Sparkles className="absolute -bottom-3 -left-5 h-3 w-3 text-violet-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Information Banner                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] px-4 py-3">
        <WandSparkles className="h-4 w-4 shrink-0 text-violet-400" />

        <p className="text-xs text-zinc-400">
          The more accurate your input, the more useful your personalized
          roadmap will be.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 01 — CAREER GOAL                                                   */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-5"
      >
        <SectionHeader
          number="01"
          icon={Target}
          title="Career Goal"
          description="Define the role and career target you are preparing for."
        />

        <div className="grid gap-5 md:grid-cols-3">
          <SelectField
            label="Target Role"
            value={role}
            options={roles}
            onChange={setRole}
          />

          <SelectField
            label="Target CTC (in LPA)"
            value={ctc}
            options={ctcOptions}
            onChange={setCtc}
          />

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">
              Roadmap Duration
            </label>

            <div className="grid grid-cols-3 gap-2">
              {durations.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={duration === item}
                  onClick={() => setDuration(item)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-zinc-400">
            Experience Level
          </label>

          <div className="flex flex-wrap gap-2">
            {experienceLevels.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={experience === item}
                onClick={() => setExperience(item)}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* 02 — CURRENT SKILLS                                                */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-5"
      >
        <SectionHeader
          number="02"
          icon={Code2}
          title="Current Skills"
          description="Select the technologies and concepts you already know."
        />

        {/* Programming */}

        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-400">
            Programming Languages
          </p>

          <div className="flex flex-wrap gap-2">
            {programmingLanguages.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={selectedLanguages.includes(item)}
                onClick={() => toggleItem(item, setSelectedLanguages)}
              />
            ))}

            <button
              type="button"
              className="rounded-lg border border-dashed border-white/[0.1] px-3 py-2 text-xs text-zinc-500 transition hover:border-violet-500/30 hover:text-violet-300"
            >
              + Add Custom
            </button>
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

        {/* CS */}

        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium text-zinc-400">CS Fundamentals</p>

          <div className="flex flex-wrap gap-2">
            {csSkills.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={selectedCS.includes(item)}
                onClick={() => toggleItem(item, setSelectedCS)}
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
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* 03 — TOPICS                                                        */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-5"
      >
        <SectionHeader
          number="03"
          icon={BookOpen}
          title="Topics / Subjects"
          description="Choose the topics you want to include in your roadmap."
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(topics).map(([category, items]) => (
            <div
              key={category}
              className="rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4"
            >
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                {category}
              </h3>

              <div className="space-y-2">
                {items.map((topic) => {
                  const selected = selectedTopics.includes(topic);

                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className="flex w-full items-center gap-2 text-left text-xs text-zinc-400 transition hover:text-zinc-200"
                    >
                      <span
                        className={`
                          flex
                          h-4
                          w-4
                          shrink-0
                          items-center
                          justify-center
                          rounded
                          border
                          transition
                          ${
                            selected
                              ? "border-violet-500 bg-violet-500 text-white"
                              : "border-white/[0.12] bg-transparent"
                          }
                        `}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>

                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* 04 — AVAILABILITY                                                  */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-5"
      >
        <SectionHeader
          number="04"
          icon={Clock3}
          title="Availability"
          description="Tell us how much time you can realistically dedicate."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hours */}

          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Hours per day
            </label>

            <div className="flex flex-wrap gap-2">
              {["1 Hour", "2 Hours", "3 Hours", "4 Hours", "5+ Hours"].map(
                (item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={hoursPerDay === item}
                    onClick={() => setHoursPerDay(item)}
                  />
                ),
              )}
            </div>
          </div>

          {/* Days */}

          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Days per week
            </label>

            <div className="flex flex-wrap gap-2">
              {["3 Days", "4 Days", "5 Days", "6 Days", "7 Days"].map(
                (item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={daysPerWeek === item}
                    onClick={() => setDaysPerWeek(item)}
                  />
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-zinc-400">
            Preferred Study Time
          </label>

          <div className="flex flex-wrap gap-2">
            {studyTimes.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={studyTime === item}
                onClick={() => setStudyTime(item)}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* 05 — CAREER PREFERENCES                                            */}
      {/* ------------------------------------------------------------------ */}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-5"
      >
        <SectionHeader
          number="05"
          icon={BriefcaseBusiness}
          title="Career Preferences"
          description="Fine-tune the roadmap according to your career goals."
        />

        <div className="grid gap-5 md:grid-cols-3">
          <SelectField
            label="Preferred Company Type"
            value={companyType}
            options={companyTypes}
            onChange={setCompanyType}
          />

          <SelectField
            label="Primary Goal"
            value={primaryGoal}
            options={primaryGoals}
            onChange={setPrimaryGoal}
          />

          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Target Companies
            </label>

            <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-white/[0.08] bg-zinc-950 p-1.5">
              {targetCompanies.map((company) => (
                <span
                  key={company}
                  className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-zinc-300"
                >
                  {company}

                  <button
                    type="button"
                    onClick={() => removeCompany(company)}
                    className="text-zinc-500 hover:text-zinc-200"
                  >
                    ×
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={addCompany}
                className="px-2 py-1 text-[11px] font-medium text-violet-400 hover:text-violet-300"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Intensity */}

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-zinc-400">
            Roadmap Intensity
          </label>

          <div className="flex flex-wrap gap-2">
            {intensityOptions.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={intensity === item}
                onClick={() => setIntensity(item)}
              />
            ))}
          </div>
        </div>

        {/* Learning style */}

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-zinc-400">
            Preferred Learning Style
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

      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-500">{role}</span>
          </div>

          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-500">{ctc}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-500">{duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-500">
              {hoursPerDay} · {daysPerWeek}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-violet-400" />
            <span className="text-xs text-zinc-500">
              {selectedTopics.length} topics selected
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* GENERATE BUTTON                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col items-center gap-3 pt-2">
        <motion.button
          type="button"
          onClick={handleGenerate}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="
            group
            flex
            min-w-[240px]
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
            hover:shadow-violet-500/30
          "
        >
          <Sparkles className="h-4 w-4" />

          {isGenerated ? "Roadmap Generated!" : "Generate My Roadmap"}

          {!isGenerated && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </motion.button>

        <p className="text-[11px] text-zinc-600">
          Your preferences will be used to create a personalized month-wise
          roadmap.
        </p>
      </div>
    </motion.div>
  );
}
