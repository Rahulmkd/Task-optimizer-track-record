"use client";

import { GlowBackground } from "@/components/shared/GlowBackground";
import {
  HomeNavbar,
  HomeHero,
  HomeShowcase,
  HomeFeatures,
  HomeWorkflow,
  HomeAICoachSection,
  HomeTechStack,
  HomeCTA,
  HomeFooter,
} from "@/features/home";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative selection:bg-violet-500/30 selection:text-white">
      {/* Ambient background glow and grid */}
      <GlowBackground />

      {/* Responsive header navigation */}
      <HomeNavbar />

      {/* Main landing content */}
      <main className="flex-1 relative z-10">
        <HomeHero />
        <HomeShowcase />
        <HomeFeatures />
        <HomeWorkflow />
        <HomeAICoachSection />
        <HomeTechStack />
        <HomeCTA />
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
