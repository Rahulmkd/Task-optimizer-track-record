"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowBackground } from "@/components/shared/GlowBackground";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <GlowBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        <p className="text-8xl font-bold text-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-white/40 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Link>
          </Button>
          <Button asChild variant="gradient">
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
