"use client";

import { motion } from "framer-motion";
import {
  Mail,
  ShieldCheck,
  Calendar,
  Phone,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";
import { IUser } from "@/features/auth/types/user.types";

interface ProfileOverviewCardProps {
  user: IUser | null;
}

export function ProfileOverviewCard({ user }: ProfileOverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center h-fit relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-600/15 blur-3xl rounded-full pointer-events-none" />

      {/* Avatar Container */}
      <div className="relative inline-block mb-4">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl shadow-violet-500/25 ring-4 ring-white/10">
          {user?.name ? getInitials(user.name) : "U"}
        </div>
        <span
          title="Account Verified"
          className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-[#0a0a0f] border-2 border-emerald-500/80 flex items-center justify-center text-emerald-400 shadow-md"
        >
          <CheckCircle2 className="h-4 w-4" />
        </span>
      </div>

      <h2 className="text-white font-semibold text-xl tracking-tight">
        {user?.name || "Loading..."}
      </h2>
      <p className="text-white/40 text-sm mt-0.5 break-all">{user?.email || "—"}</p>

      <div className="flex items-center justify-center gap-2 mt-3 mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified Member
        </span>
      </div>

      {/* Detail stats list */}
      <div className="pt-5 border-t border-white/5 text-left space-y-3.5">
        <div className="flex items-center gap-3 text-sm">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4 text-violet-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/40 font-medium">Email Address</p>
            <p className="text-white/80 text-sm truncate">{user?.email || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Phone className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/40 font-medium">Phone Number</p>
            <p className="text-white/80 text-sm truncate">
              {user?.phoneNumber || "Not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Calendar className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/40 font-medium">Member Since</p>
            <p className="text-white/80 text-sm">
              {user?.createdAt ? formatDate(user.createdAt) : "—"}
            </p>
          </div>
        </div>

        {user?.updatedAt && (
          <div className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/40 font-medium">Last Updated</p>
              <p className="text-white/80 text-sm">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
