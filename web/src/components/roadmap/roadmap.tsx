"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Map,
  Rocket,
  Target,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                              ROADMAP DATA                                  */
/* -------------------------------------------------------------------------- */

const roadmapData = [
  {
    id: "2-month",
    title: "2 Month",
    subtitle: "SDE Roadmap",
    description:
      "An intensive roadmap focused on interview preparation, DSA, core CS and backend fundamentals.",
    duration: "8 Weeks",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    href: "/roadmap/2-month",
  },
  {
    id: "3-month",
    title: "3 Month",
    subtitle: "SDE Roadmap",
    description:
      "A balanced roadmap covering DSA, CS fundamentals, development and interview preparation.",
    duration: "12 Weeks",
    icon: Target,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    href: "/roadmap/3-month",
  },
  {
    id: "6-month",
    title: "6 Month",
    subtitle: "SDE Roadmap",
    description:
      "A complete long-term roadmap to build strong DSA, development, system design and interview skills.",
    duration: "24 Weeks",
    icon: Rocket,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    href: "/roadmap/6-month",
  },
];

/* -------------------------------------------------------------------------- */
/*                              ROADMAP CARD                                  */
/* -------------------------------------------------------------------------- */

export function RoadmapCard({
  title,
  subtitle,
  description,
  duration,
  icon: Icon,
  color,
  bg,
  border,
  href,
}: (typeof roadmapData)[number]) {
  const router = useRouter();

  return (
    <motion.button
      type="button"
      onClick={() => router.push(href)}
      whileHover={{
        y: -5,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        ${border}
        bg-zinc-900/70
        p-5
        text-left
        transition-all
        duration-300
        hover:bg-zinc-900
        hover:shadow-xl
        focus:outline-none
        focus:ring-2
        focus:ring-violet-500/30
      `}
    >
      {/* Decorative background */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          ${bg}
          opacity-40
          blur-2xl
          transition-all
          duration-500
          group-hover:scale-150
        `}
      />

      {/* Header */}

      <div className="relative flex items-start justify-between">
        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            ${bg}
          `}
        >
          <Icon className={`h-5 w-5 ${color}`} />
        </div>

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white/[0.04]
            transition-all
            duration-300
            group-hover:bg-white/[0.08]
          "
        >
          <ArrowRight
            className="
              h-4
              w-4
              text-zinc-500
              transition-transform
              duration-300
              group-hover:translate-x-1
              group-hover:text-zinc-200
            "
          />
        </div>
      </div>

      {/* Title */}

      <div className="relative mt-5">
        <h3 className="text-xl font-black tracking-tight text-white">
          {title}
        </h3>

        <p className={`mt-1 text-sm font-semibold ${color}`}>{subtitle}</p>
      </div>

      {/* Description */}

      <p className="relative mt-3 min-h-[48px] text-sm leading-6 text-zinc-400">
        {description}
      </p>

      {/* Duration */}

      <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <CalendarDays className="h-4 w-4" />

          <span>{duration}</span>
        </div>

        <span
          className="
            text-xs
            font-semibold
            text-zinc-500
            transition-colors
            duration-300
            group-hover:text-zinc-200
          "
        >
          View roadmap
        </span>
      </div>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ROOT EXPORT                                   */
/* -------------------------------------------------------------------------- */

export function Roadmapsh() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.38,
        ease: "easeOut",
      }}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Map className="h-4 w-4 text-violet-400" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              SDE Roadmaps
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            Choose your roadmap
          </h1>

          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Select a roadmap based on the amount of time you have available for
            your SDE preparation.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Roadmap Cards                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {roadmapData.map((roadmap, index) => (
          <motion.div
            key={roadmap.id}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.08,
              ease: "easeOut",
            }}
          >
            <RoadmapCard {...roadmap} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
