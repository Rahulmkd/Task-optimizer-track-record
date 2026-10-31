"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { APP_NAME, APP_DESCRIPTION, ROUTES } from "@/constants/constants";

export function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07070b] py-14 text-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" />
              <span className="text-base font-bold text-white tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-xs sm:text-sm text-white/50 max-w-sm leading-relaxed">
              {APP_DESCRIPTION} Intelligent daily task tracking, weekly sprint capacity planning,
              mathematical SVG analytics, and an automated AI coach.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={ROUTES.DASHBOARD} className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href={ROUTES.MY_TASK} className="hover:text-white transition-colors">
                  Daily Tasks
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PROGRESS} className="hover:text-white transition-colors">
                  Analytics & Charts
                </Link>
              </li>
              <li>
                <Link href={ROUTES.STORY} className="hover:text-white transition-colors">
                  AI Coach Journal
                </Link>
              </li>
              <li>
                <a
                  href={ROUTES.ROADMAP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Career Roadmap</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Authentication & Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Access</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={ROUTES.LOGIN} className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href={ROUTES.SETTINGS} className="hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PROFILE} className="hover:text-white transition-colors">
                  Profile Management
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div suppressHydrationWarning>
            © 2026 {APP_NAME}. Built with Next.js 16, React 19 &amp; Tailwind CSS v4.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/40">Dual-Token Security</span>
            <span className="text-[11px] text-white/40">•</span>
            <span className="text-[11px] text-white/40">LangChain Gemini & Groq</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
