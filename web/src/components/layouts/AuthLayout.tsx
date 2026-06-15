"use client";

import { motion } from "framer-motion";
import { GlowBackground } from "@/components/shared/GlowBackground";
import { APP_NAME } from "@/constants/constants";
import Link from "next/link";
import { Zap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <GlowBackground />

      {/* Nav */}
      <nav className="relative z-10 p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">{APP_NAME}</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/50"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="glass-card rounded-2xl p-8"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
