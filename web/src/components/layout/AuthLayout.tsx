"use client";

import { motion } from "framer-motion";
import { GlowBackground } from "@/components/shared/GlowBackground";
import { APP_NAME } from "@/constants/constants";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col selection:bg-violet-500/30 selection:text-white">
      <GlowBackground />

      {/* Top Nav */}
      <nav className="relative z-10 px-4 py-5 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
          <Logo size="sm" priority />
          <span className="text-white font-bold text-base tracking-tight">{APP_NAME}</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main Form Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-6 sm:mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.16 }}
                className="text-white/50 text-xs sm:text-sm mt-1.5"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.35 }}
            className="rounded-2xl border border-white/10 bg-[#0e0e16]/80 backdrop-blur-2xl p-5 sm:p-8 shadow-2xl shadow-black/60"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
