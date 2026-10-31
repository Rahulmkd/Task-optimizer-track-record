"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { GlowBackground } from "@/components/shared/GlowBackground";
import { ROUTES } from "@/constants/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 relative selection:bg-violet-500/30 selection:text-white">
      <GlowBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 text-center max-w-md w-full p-8 rounded-3xl border border-white/10 bg-[#0e0e16]/80 backdrop-blur-2xl shadow-2xl shadow-black/80"
      >
        <Logo size="xl" className="border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.25)] mx-auto mb-5" />

        <p className="text-7xl sm:text-8xl font-black text-gradient tracking-tight mb-2">
          404
        </p>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-white/50 text-xs sm:text-sm mb-7 leading-relaxed">
          The destination you requested doesn&apos;t exist or has been relocated within the application.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" size="default" className="w-full sm:w-auto">
            <Link href={ROUTES.DASHBOARD}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>

          <Button asChild variant="gradient" size="default" className="w-full sm:w-auto">
            <Link href={ROUTES.HOME}>
              <Home className="h-4 w-4" />
              <span>Home Page</span>
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
