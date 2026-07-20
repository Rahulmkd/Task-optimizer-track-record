"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layouts/DashboardShell";
import { useAppSelector } from "@/redux/hooks";
import { QuickActions } from "@/components/dashboard/quick-actions/QuickActions";

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <DashboardShell>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">
          {greeting},{" "}
          <span className="text-gradient">
            {user?.name?.split(" ")[0] || "there"}
          </span>{" "}
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </motion.div>

      {/* QuickActions */}
      <div className="mb-6">
        <QuickActions />
      </div>
    </DashboardShell>
  );
}
