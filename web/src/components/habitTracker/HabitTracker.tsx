// "use client";

// import { useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft,
//   ArrowRight,
//   CalendarDays,
//   Check,
//   Flame,
//   Plus,
//   Target,
//   Trophy,
//   X,
// } from "lucide-react";

// /* -------------------------------------------------------------------------- */
// /*                              TYPES                                         */
// /* -------------------------------------------------------------------------- */

// type Habit = {
//   id: number;
//   name: string;
//   icon?: string;
//   color: string;
//   completed: number[];
// };

// /* -------------------------------------------------------------------------- */
// /*                              DEMO DATA                                     */
// /* -------------------------------------------------------------------------- */

// const initialHabits: Habit[] = [
//   {
//     id: 1,
//     name: "DSA Practice",
//     icon: "💻",
//     color: "violet",
//     completed: [1, 2, 3, 5, 6, 8, 9, 12, 13, 15, 16, 18],
//   },
//   {
//     id: 2,
//     name: "Backend Development",
//     icon: "⚙️",
//     color: "blue",
//     completed: [1, 2, 4, 5, 7, 8, 10, 11, 13, 15, 17],
//   },
//   {
//     id: 3,
//     name: "Exercise",
//     icon: "🏋️",
//     color: "orange",
//     completed: [1, 2, 3, 4, 6, 7, 9, 10, 12, 14, 16, 18],
//   },
//   {
//     id: 4,
//     name: "Read / Learn",
//     icon: "📚",
//     color: "emerald",
//     completed: [2, 3, 5, 6, 8, 10, 11, 13, 14, 17],
//   },
//   {
//     id: 5,
//     name: "Job Preparation",
//     icon: "🎯",
//     color: "pink",
//     completed: [1, 3, 4, 6, 8, 9, 12, 15, 16],
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /*                              DAYS                                          */
// /* -------------------------------------------------------------------------- */

// const days = Array.from({ length: 31 }, (_, index) => index + 1);

// /* -------------------------------------------------------------------------- */
// /*                              COLOR HELPERS                                 */
// /* -------------------------------------------------------------------------- */

// function getHabitColor(color: string) {
//   const colors: Record<string, string> = {
//     violet:
//       "bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30",
//     blue: "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
//     orange:
//       "bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30",
//     emerald:
//       "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30",
//     pink: "bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30",
//   };

//   return colors[color] ?? colors.violet;
// }

// /* -------------------------------------------------------------------------- */
// /*                              HABIT CELL                                    */
// /* -------------------------------------------------------------------------- */

// function HabitCell({
//   completed,
//   color,
//   onClick,
// }: {
//   completed: boolean;
//   color: string;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`
//         group
//         flex
//         h-9
//         w-9
//         shrink-0
//         items-center
//         justify-center
//         border-r
//         border-white/[0.05]
//         transition-all
//         duration-150
//         hover:bg-white/[0.04]
//       `}
//     >
//       <motion.div
//         initial={false}
//         animate={{
//           scale: completed ? 1 : 0.8,
//           opacity: completed ? 1 : 0.5,
//         }}
//         whileTap={{ scale: 0.75 }}
//         className={`
//           flex
//           h-6
//           w-6
//           items-center
//           justify-center
//           rounded-md
//           border
//           transition-all
//           duration-200
//           ${
//             completed
//               ? getHabitColor(color)
//               : "border-white/[0.08] bg-white/[0.015] text-transparent group-hover:border-white/[0.15]"
//           }
//         `}
//       >
//         {completed && <Check className="h-3.5 w-3.5" />}
//       </motion.div>
//     </button>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*                              ROOT EXPORT                                   */
// /* -------------------------------------------------------------------------- */

// export function HabitTracker() {
//   const [habits, setHabits] = useState<Habit[]>(initialHabits);

//   const [selectedMonth, setSelectedMonth] = useState("August 2026");

//   /* ------------------------------------------------------------------------ */
//   /* Toggle Habit                                                             */
//   /* ------------------------------------------------------------------------ */

//   const toggleDay = (habitId: number, day: number) => {
//     setHabits((current) =>
//       current.map((habit) => {
//         if (habit.id !== habitId) return habit;

//         const alreadyCompleted = habit.completed.includes(day);

//         return {
//           ...habit,
//           completed: alreadyCompleted
//             ? habit.completed.filter((item) => item !== day)
//             : [...habit.completed, day],
//         };
//       }),
//     );
//   };

//   /* ------------------------------------------------------------------------ */
//   /* Add Habit                                                                */
//   /* ------------------------------------------------------------------------ */

//   const addHabit = () => {
//     const name = window.prompt("Enter habit name");

//     if (!name?.trim()) return;

//     setHabits((current) => [
//       ...current,
//       {
//         id: Date.now(),
//         name: name.trim(),
//         icon: "✨",
//         color: "violet",
//         completed: [],
//       },
//     ]);
//   };

//   /* ------------------------------------------------------------------------ */
//   /* Delete Habit                                                             */
//   /* ------------------------------------------------------------------------ */

//   const deleteHabit = (habitId: number) => {
//     setHabits((current) => current.filter((habit) => habit.id !== habitId));
//   };

//   /* ------------------------------------------------------------------------ */
//   /* Statistics                                                               */
//   /* ------------------------------------------------------------------------ */

//   const totalCompleted = useMemo(() => {
//     return habits.reduce((total, habit) => total + habit.completed.length, 0);
//   }, [habits]);

//   const totalPossible = habits.length * 31;

//   const completionPercentage =
//     totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

//   const currentStreak = useMemo(() => {
//     if (!habits.length) return 0;

//     let streak = 0;

//     for (let day = 31; day >= 1; day--) {
//       const completedEveryHabit = habits.every((habit) =>
//         habit.completed.includes(day),
//       );

//       if (!completedEveryHabit) break;

//       streak++;
//     }

//     return streak;
//   }, [habits]);

//   /* ------------------------------------------------------------------------ */
//   /* Render                                                                   */
//   /* ------------------------------------------------------------------------ */

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{
//         duration: 0.38,
//         ease: "easeOut",
//       }}
//       className="space-y-5 pb-10"
//     >
//       {/* ------------------------------------------------------------------ */}
//       {/* HEADER                                                             */}
//       {/* ------------------------------------------------------------------ */}

//       <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6">
//         {/* Decorative glow */}

//         <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

//         <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//           {/* Left */}

//           <div>
//             <div className="mb-3 flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
//                 <Target className="h-4 w-4 text-violet-400" />
//               </div>

//               <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
//                 Consistency Challenge
//               </span>
//             </div>

//             <h1 className="text-3xl font-black tracking-tight text-white">
//               Habit Tracker
//             </h1>

//             <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
//               Build consistency by showing up every day. Track your habits and
//               keep your streak alive.
//             </p>
//           </div>

//           {/* Month selector */}

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               className="
//                 flex
//                 h-9
//                 w-9
//                 items-center
//                 justify-center
//                 rounded-lg
//                 border
//                 border-white/[0.07]
//                 bg-white/[0.02]
//                 text-zinc-500
//                 transition
//                 hover:bg-white/[0.05]
//                 hover:text-zinc-200
//               "
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </button>

//             <div className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-zinc-950/60 px-3">
//               <CalendarDays className="h-4 w-4 text-violet-400" />

//               <span className="text-xs font-semibold text-zinc-300">
//                 {selectedMonth}
//               </span>
//             </div>

//             <button
//               type="button"
//               className="
//                 flex
//                 h-9
//                 w-9
//                 items-center
//                 justify-center
//                 rounded-lg
//                 border
//                 border-white/[0.07]
//                 bg-white/[0.02]
//                 text-zinc-500
//                 transition
//                 hover:bg-white/[0.05]
//                 hover:text-zinc-200
//               "
//             >
//               <ArrowRight className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ------------------------------------------------------------------ */}
//       {/* STATS                                                              */}
//       {/* ------------------------------------------------------------------ */}

//       <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
//         {/* Total Habits */}

//         <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-4">
//           <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
//             <Target className="h-4 w-4 text-violet-400" />
//           </div>

//           <p className="text-xs text-zinc-500">Total Habits</p>

//           <p className="mt-1 text-xl font-black text-white">{habits.length}</p>
//         </div>

//         {/* Completed */}

//         <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-4">
//           <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
//             <Check className="h-4 w-4 text-emerald-400" />
//           </div>

//           <p className="text-xs text-zinc-500">Completed</p>

//           <p className="mt-1 text-xl font-black text-white">{totalCompleted}</p>
//         </div>

//         {/* Completion */}

//         <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-4">
//           <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
//             <Trophy className="h-4 w-4 text-blue-400" />
//           </div>

//           <p className="text-xs text-zinc-500">Completion</p>

//           <p className="mt-1 text-xl font-black text-white">
//             {completionPercentage}%
//           </p>
//         </div>

//         {/* Streak */}

//         <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-4">
//           <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
//             <Flame className="h-4 w-4 text-orange-400" />
//           </div>

//           <p className="text-xs text-zinc-500">Current Streak</p>

//           <p className="mt-1 text-xl font-black text-white">
//             {currentStreak}{" "}
//             <span className="text-xs font-medium text-zinc-500">days</span>
//           </p>
//         </div>
//       </div>

//       {/* ------------------------------------------------------------------ */}
//       {/* HABIT TRACKER                                                      */}
//       {/* ------------------------------------------------------------------ */}

//       <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/50">
//         {/* Tracker Header */}

//         <div className="flex items-center justify-between border-b border-white/[0.06] p-4">
//           <div>
//             <h2 className="text-sm font-bold text-white">Monthly Habits</h2>

//             <p className="mt-1 text-xs text-zinc-500">
//               Click a cell to mark a habit as complete.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={addHabit}
//             className="
//               flex
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-violet-500/20
//               bg-violet-500/10
//               px-3
//               py-2
//               text-xs
//               font-semibold
//               text-violet-300
//               transition
//               hover:bg-violet-500/15
//               hover:text-violet-200
//             "
//           >
//             <Plus className="h-3.5 w-3.5" />
//             Add Habit
//           </button>
//         </div>

//         {/* ---------------------------------------------------------------- */}
//         {/* SCROLL CONTAINER                                                 */}
//         {/* ---------------------------------------------------------------- */}

//         <div className="overflow-x-auto">
//           <div className="min-w-[1215px]">
//             {/* ------------------------------------------------------------ */}
//             {/* DAY HEADER                                                    */}
//             {/* ------------------------------------------------------------ */}

//             <div className="flex border-b border-white/[0.07] bg-zinc-950/60">
//               {/* Habit heading */}

//               <div
//                 className="
//                   sticky
//                   left-0
//                   z-20
//                   flex
//                   h-10
//                   w-[165px]
//                   shrink-0
//                   items-center
//                   border-r
//                   border-white/[0.07]
//                   bg-zinc-950
//                   px-4
//                 "
//               >
//                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
//                   Habits
//                 </span>
//               </div>

//               {/* Days */}

//               {days.map((day) => (
//                 <div
//                   key={day}
//                   className="
//                     flex
//                     h-10
//                     w-9
//                     shrink-0
//                     items-center
//                     justify-center
//                     border-r
//                     border-white/[0.05]
//                   "
//                 >
//                   <span className="text-[10px] font-semibold text-zinc-500">
//                     {day}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* ------------------------------------------------------------ */}
//             {/* HABIT ROWS                                                    */}
//             {/* ------------------------------------------------------------ */}

//             {habits.map((habit, index) => (
//               <motion.div
//                 key={habit.id}
//                 initial={{
//                   opacity: 0,
//                   x: -5,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   x: 0,
//                 }}
//                 transition={{
//                   delay: index * 0.04,
//                 }}
//                 className="
//                   group
//                   flex
//                   border-b
//                   border-white/[0.05]
//                   last:border-b-0
//                 "
//               >
//                 {/* Habit name */}

//                 <div
//                   className="
//                     sticky
//                     left-0
//                     z-10
//                     flex
//                     h-12
//                     w-[165px]
//                     shrink-0
//                     items-center
//                     justify-between
//                     border-r
//                     border-white/[0.07]
//                     bg-zinc-900
//                     px-3
//                   "
//                 >
//                   <div className="flex min-w-0 items-center gap-2">
//                     <span className="text-sm">{habit.icon}</span>

//                     <span className="truncate text-xs font-semibold text-zinc-300">
//                       {habit.name}
//                     </span>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => deleteHabit(habit.id)}
//                     className="
//                       hidden
//                       text-zinc-600
//                       transition
//                       hover:text-red-400
//                       group-hover:block
//                     "
//                     title="Delete habit"
//                   >
//                     <X className="h-3.5 w-3.5" />
//                   </button>
//                 </div>

//                 {/* Days */}

//                 {days.map((day) => (
//                   <HabitCell
//                     key={day}
//                     completed={habit.completed.includes(day)}
//                     color={habit.color}
//                     onClick={() => toggleDay(habit.id, day)}
//                   />
//                 ))}
//               </motion.div>
//             ))}

//             {/* ------------------------------------------------------------ */}
//             {/* ADD HABIT ROW                                                 */}
//             {/* ------------------------------------------------------------ */}

//             <button
//               type="button"
//               onClick={addHabit}
//               className="
//                 flex
//                 h-12
//                 w-full
//                 items-center
//                 border-b
//                 border-white/[0.05]
//                 text-left
//                 transition
//                 hover:bg-white/[0.02]
//               "
//             >
//               <div className="flex w-[165px] shrink-0 items-center gap-2 px-4">
//                 <div className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-white/[0.1]">
//                   <Plus className="h-3 w-3 text-zinc-600" />
//                 </div>

//                 <span className="text-xs text-zinc-600">Add another habit</span>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* ---------------------------------------------------------------- */}
//         {/* FOOTER                                                           */}
//         {/* ---------------------------------------------------------------- */}

//         <div className="flex flex-col gap-3 border-t border-white/[0.06] bg-zinc-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <span className="h-3 w-3 rounded-md border border-white/[0.08] bg-white/[0.02]" />

//               <span className="text-[11px] text-zinc-600">Not completed</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="flex h-3 w-3 items-center justify-center rounded-md border border-violet-500/30 bg-violet-500/20">
//                 <Check className="h-2 w-2 text-violet-300" />
//               </span>

//               <span className="text-[11px] text-zinc-600">Completed</span>
//             </div>
//           </div>

//           <p className="text-[11px] text-zinc-600">
//             Tip: Keep the streak alive. Consistency beats intensity.
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Flame,
  MoreHorizontal,
  Plus,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Habit = {
  id: number;
  name: string;
  icon: string;
  color: "violet" | "blue" | "orange" | "emerald" | "pink";
  completed: number[];
};

/* -------------------------------------------------------------------------- */
/* DEMO DATA                                                                  */
/* -------------------------------------------------------------------------- */

const initialHabits: Habit[] = [
  {
    id: 1,
    name: "DSA Practice",
    icon: "💻",
    color: "violet",
    completed: [1, 2, 3, 5, 6, 8, 9, 12, 13, 15, 16, 18],
  },
  {
    id: 2,
    name: "Backend Development",
    icon: "⚙️",
    color: "blue",
    completed: [1, 2, 4, 5, 7, 8, 10, 11, 13, 15, 17],
  },
  {
    id: 3,
    name: "Exercise",
    icon: "🏋️",
    color: "orange",
    completed: [1, 2, 3, 4, 6, 7, 9, 10, 12, 14, 16, 18],
  },
  {
    id: 4,
    name: "Read / Learn",
    icon: "📚",
    color: "emerald",
    completed: [2, 3, 5, 6, 8, 10, 11, 13, 14, 17],
  },
  {
    id: 5,
    name: "Job Preparation",
    icon: "🎯",
    color: "pink",
    completed: [1, 3, 4, 6, 8, 9, 12, 15, 16],
  },
];

/* -------------------------------------------------------------------------- */
/* DAYS                                                                       */
/* -------------------------------------------------------------------------- */

const days = Array.from({ length: 31 }, (_, index) => index + 1);

/* -------------------------------------------------------------------------- */
/* COLOR CONFIG                                                               */
/* -------------------------------------------------------------------------- */

const colorConfig = {
  violet: {
    text: "text-violet-400",
    bg: "bg-violet-500",
    soft: "bg-violet-500/10",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
    cell: "bg-violet-500/80",
  },

  blue: {
    text: "text-blue-400",
    bg: "bg-blue-500",
    soft: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    cell: "bg-blue-500/80",
  },

  orange: {
    text: "text-orange-400",
    bg: "bg-orange-500",
    soft: "bg-orange-500/10",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/20",
    cell: "bg-orange-500/80",
  },

  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    soft: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    cell: "bg-emerald-500/80",
  },

  pink: {
    text: "text-pink-400",
    bg: "bg-pink-500",
    soft: "bg-pink-500/10",
    border: "border-pink-500/30",
    glow: "shadow-pink-500/20",
    cell: "bg-pink-500/80",
  },
};

/* -------------------------------------------------------------------------- */
/* DAY NAME                                                                   */
/* -------------------------------------------------------------------------- */

function getDayName(day: number) {
  const date = new Date(2026, 7, day);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

/* -------------------------------------------------------------------------- */
/* IS WEEKEND                                                                 */
/* -------------------------------------------------------------------------- */

function isWeekend(day: number) {
  const date = new Date(2026, 7, day);

  const weekday = date.getDay();

  return weekday === 0 || weekday === 6;
}

/* -------------------------------------------------------------------------- */
/* PROGRESS BAR                                                               */
/* -------------------------------------------------------------------------- */

function ProgressBar({
  value,
  color,
}: {
  value: number;
  color: Habit["color"];
}) {
  const config = colorConfig[color];

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className={`h-full rounded-full ${config.bg}`}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HABIT CELL                                                                 */
/* -------------------------------------------------------------------------- */

function HabitCell({
  completed,
  color,
  day,
  onClick,
}: {
  completed: boolean;
  color: Habit["color"];
  day: number;
  onClick: () => void;
}) {
  const config = colorConfig[color];

  const isToday = day === 18;
  const weekend = isWeekend(day);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        flex
        h-[52px]
        w-[42px]
        shrink-0
        items-center
        justify-center
        border-r
        border-white/[0.045]
        transition-colors
        duration-200

        ${weekend ? "bg-white/[0.012]" : "bg-transparent"}

        ${isToday ? "bg-violet-500/[0.045]" : ""}
      `}
    >
      {/* Today indicator */}

      {isToday && (
        <span className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-violet-500" />
      )}

      <motion.div
        initial={false}
        animate={{
          scale: completed ? 1 : 0.8,
          opacity: completed ? 1 : 0.35,
        }}
        whileHover={{
          scale: completed ? 1.08 : 0.95,
        }}
        whileTap={{
          scale: 0.7,
        }}
        className={`
          relative
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-lg
          border
          transition-all
          duration-200

          ${
            completed
              ? `${config.cell} ${config.border} shadow-lg ${config.glow}`
              : "border-white/[0.07] bg-white/[0.018] group-hover:border-white/[0.15] group-hover:bg-white/[0.04]"
          }
        `}
      >
        {completed && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Check className="h-3.5 w-3.5 text-white" />
          </motion.div>
        )}
      </motion.div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* ROOT                                                                       */
/* -------------------------------------------------------------------------- */

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  /* ------------------------------------------------------------------------ */
  /* TOGGLE DAY                                                               */
  /* ------------------------------------------------------------------------ */

  const toggleDay = (habitId: number, day: number) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const completed = habit.completed.includes(day);

        return {
          ...habit,
          completed: completed
            ? habit.completed.filter((item) => item !== day)
            : [...habit.completed, day],
        };
      }),
    );
  };

  /* ------------------------------------------------------------------------ */
  /* ADD HABIT                                                                */
  /* ------------------------------------------------------------------------ */

  const addHabit = () => {
    const name = window.prompt("Enter habit name");

    if (!name?.trim()) return;

    setHabits((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        icon: "✨",
        color: "violet",
        completed: [],
      },
    ]);
  };

  /* ------------------------------------------------------------------------ */
  /* DELETE HABIT                                                             */
  /* ------------------------------------------------------------------------ */

  const deleteHabit = (id: number) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  };

  /* ------------------------------------------------------------------------ */
  /* TOTAL COMPLETED                                                          */
  /* ------------------------------------------------------------------------ */

  const totalCompleted = useMemo(() => {
    return habits.reduce((total, habit) => total + habit.completed.length, 0);
  }, [habits]);

  /* ------------------------------------------------------------------------ */
  /* COMPLETION                                                               */
  /* ------------------------------------------------------------------------ */

  const totalPossible = habits.length * days.length;

  const completion =
    totalPossible === 0
      ? 0
      : Math.round((totalCompleted / totalPossible) * 100);

  /* ------------------------------------------------------------------------ */
  /* TODAY COMPLETION                                                         */
  /* ------------------------------------------------------------------------ */

  const today = 18;

  const todayCompleted = habits.filter((habit) =>
    habit.completed.includes(today),
  ).length;

  const todayPercentage =
    habits.length === 0
      ? 0
      : Math.round((todayCompleted / habits.length) * 100);

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="space-y-5 pb-10"
    >
      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/20 p-6 md:p-7">
        {/* Glow */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/[0.04] blur-3xl" />

        {/* Top */}

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <Target className="h-4 w-4 text-violet-400" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                Consistency Challenge
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Build Your Streak.
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">
              Small actions every day create remarkable results. Keep showing
              up.
            </p>
          </div>

          {/* Progress */}

          <div className="relative flex items-center gap-5">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-white/[0.05]"
                />

                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="264"
                  initial={{
                    strokeDashoffset: 264,
                  }}
                  animate={{
                    strokeDashoffset: 264 - (264 * completion) / 100,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className="text-violet-500"
                />
              </svg>

              <div className="absolute text-center">
                <p className="text-2xl font-black text-white">{completion}%</p>

                <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                  Complete
                </p>
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" />

                <span className="text-xs font-bold text-orange-300">
                  Keep going
                </span>
              </div>

              <p className="text-sm font-semibold text-zinc-300">
                {totalCompleted} habits completed
              </p>

              <p className="mt-1 text-xs text-zinc-600">this month</p>
            </div>
          </div>
        </div>

        {/* Month Navigation */}

        <div className="relative mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3">
              <CalendarDays className="h-4 w-4 text-violet-400" />

              <span className="text-xs font-bold text-zinc-300">
                August 2026
              </span>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/[0.025] px-3 py-2">
            <Zap className="h-3.5 w-3.5 text-violet-400" />

            <span className="text-[11px] text-zinc-500">Today</span>

            <span className="text-xs font-bold text-zinc-300">
              {todayPercentage}%
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* QUICK STATS                                                        */}
      {/* ================================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Habits */}

        <motion.div
          whileHover={{ y: -2 }}
          className="group rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 transition hover:border-violet-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
              <Target className="h-4 w-4 text-violet-400" />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
              Total
            </span>
          </div>

          <p className="mt-4 text-xs text-zinc-600">Active habits</p>

          <p className="mt-1 text-2xl font-black text-white">{habits.length}</p>
        </motion.div>

        {/* Completed */}

        <motion.div
          whileHover={{ y: -2 }}
          className="group rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 transition hover:border-emerald-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <Check className="h-4 w-4 text-emerald-400" />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
              Month
            </span>
          </div>

          <p className="mt-4 text-xs text-zinc-600">Completed</p>

          <p className="mt-1 text-2xl font-black text-white">
            {totalCompleted}
          </p>
        </motion.div>

        {/* Today */}

        <motion.div
          whileHover={{ y: -2 }}
          className="group rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 transition hover:border-blue-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
              <CalendarDays className="h-4 w-4 text-blue-400" />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
              Day 18
            </span>
          </div>

          <p className="mt-4 text-xs text-zinc-600">Today</p>

          <p className="mt-1 text-2xl font-black text-white">
            {todayCompleted}
            <span className="ml-1 text-sm text-zinc-600">
              / {habits.length}
            </span>
          </p>
        </motion.div>

        {/* Streak */}

        <motion.div
          whileHover={{ y: -2 }}
          className="group rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 transition hover:border-orange-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10">
              <Flame className="h-4 w-4 text-orange-400" />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
              Streak
            </span>
          </div>

          <p className="mt-4 text-xs text-zinc-600">Current streak</p>

          <p className="mt-1 text-2xl font-black text-white">
            7<span className="ml-1 text-sm text-zinc-600">days</span>
          </p>
        </motion.div>
      </div>

      {/* ================================================================== */}
      {/* TRACKER                                                            */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-zinc-900/60 shadow-2xl shadow-black/20">
        {/* Tracker Header */}

        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-violet-400" />

              <h2 className="text-sm font-bold text-white">Monthly Habits</h2>
            </div>

            <p className="mt-1 text-xs text-zinc-600">
              Click a day to mark your habit complete.
            </p>
          </div>

          <button
            type="button"
            onClick={addHabit}
            className="group flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-300 transition hover:border-violet-500/30 hover:bg-violet-500/15 hover:text-violet-200"
          >
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            Add Habit
          </button>
        </div>

        {/* Tracker */}

        <div className="overflow-x-auto">
          <div className="min-w-[1470px]">
            {/* ------------------------------------------------------------ */}
            {/* DAYS HEADER                                                   */}
            {/* ------------------------------------------------------------ */}

            <div className="flex border-b border-white/[0.07] bg-zinc-950/80">
              {/* Habit */}

              <div className="sticky left-0 z-30 flex h-16 w-[225px] shrink-0 items-center border-r border-white/[0.07] bg-zinc-950 px-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                    Monthly
                  </p>

                  <p className="mt-1 text-xs font-bold text-zinc-300">Habits</p>
                </div>
              </div>

              {/* Days */}

              {days.map((day) => {
                const weekend = isWeekend(day);
                const isToday = day === today;

                return (
                  <div
                    key={day}
                    className={`
                      flex
                      h-16
                      w-[42px]
                      shrink-0
                      flex-col
                      items-center
                      justify-center
                      border-r
                      border-white/[0.045]

                      ${weekend ? "bg-white/[0.015]" : ""}

                      ${isToday ? "bg-violet-500/[0.06]" : ""}
                    `}
                  >
                    <span
                      className={`
                        text-[9px] font-medium
                        ${isToday ? "text-violet-400" : "text-zinc-700"}
                      `}
                    >
                      {getDayName(day)}
                    </span>

                    <span
                      className={`
                        mt-1 flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold

                        ${
                          isToday
                            ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                            : "text-zinc-500"
                        }
                      `}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* HABITS                                                        */}
            {/* ------------------------------------------------------------ */}

            {habits.map((habit, index) => {
              const config = colorConfig[habit.color];

              const progress = Math.round((habit.completed.length / 31) * 100);

              return (
                <motion.div
                  key={habit.id}
                  initial={{
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="group flex border-b border-white/[0.05]"
                >
                  {/* Habit information */}

                  <div className="sticky left-0 z-20 flex h-[84px] w-[225px] shrink-0 items-center border-r border-white/[0.07] bg-zinc-900 px-4">
                    <div className="flex w-full items-center gap-3">
                      {/* Icon */}

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.border} ${config.soft}`}
                      >
                        <span className="text-base">{habit.icon}</span>
                      </div>

                      {/* Name */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-bold text-zinc-300">
                            {habit.name}
                          </p>

                          <span
                            className={`text-[9px] font-bold ${config.text}`}
                          >
                            {progress}%
                          </span>
                        </div>

                        <div className="mt-2">
                          <ProgressBar value={progress} color={habit.color} />
                        </div>
                      </div>

                      {/* Menu */}

                      <button
                        type="button"
                        onClick={() => deleteHabit(habit.id)}
                        className="hidden shrink-0 text-zinc-700 transition hover:text-red-400 group-hover:block"
                        title="Delete habit"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cells */}

                  {days.map((day) => (
                    <HabitCell
                      key={day}
                      day={day}
                      completed={habit.completed.includes(day)}
                      color={habit.color}
                      onClick={() => toggleDay(habit.id, day)}
                    />
                  ))}
                </motion.div>
              );
            })}

            {/* ------------------------------------------------------------ */}
            {/* ADD ROW                                                       */}
            {/* ------------------------------------------------------------ */}

            <button
              type="button"
              onClick={addHabit}
              className="flex h-[64px] w-full items-center border-b border-white/[0.05] text-left transition hover:bg-violet-500/[0.02]"
            >
              <div className="sticky left-0 flex w-[225px] shrink-0 items-center gap-3 px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-white/[0.1] transition group-hover:border-violet-500/30">
                  <Plus className="h-3.5 w-3.5 text-zinc-600" />
                </div>

                <span className="text-xs font-medium text-zinc-600">
                  Add another habit
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-col gap-4 bg-zinc-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {/* Empty */}

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md border border-white/[0.08] bg-white/[0.02]" />

              <span className="text-[10px] text-zinc-600">Not completed</span>
            </div>

            {/* Completed */}

            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 items-center justify-center rounded-md bg-violet-500">
                <Check className="h-2 w-2 text-white" />
              </span>

              <span className="text-[10px] text-zinc-600">Completed</span>
            </div>

            {/* Today */}

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md border border-violet-500/30 bg-violet-500/10" />

              <span className="text-[10px] text-zinc-600">Today</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-zinc-700">
            <Sparkles className="h-3 w-3" />
            Consistency beats intensity.
          </div>
        </div>
      </section>
    </motion.div>
  );
}
