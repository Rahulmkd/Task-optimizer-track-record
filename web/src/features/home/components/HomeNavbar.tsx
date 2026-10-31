"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { APP_NAME, ROUTES } from "@/constants/constants";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { useIsMounted } from "@/hooks/useIsMounted";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Interactive Demo", href: "#showcase" },
  { label: "How It Works", href: "#workflow" },
  { label: "AI Coach", href: "#ai-coach" },
  { label: "Architecture", href: "#architecture" },
  { label: "Roadmap", href: ROUTES.ROADMAP, external: true },
];

export function HomeNavbar() {
  const router = useRouter();
  const mounted = useIsMounted();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuth = mounted && isAuthenticated;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0f]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href={ROUTES.HOME}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Logo size="md" priority />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              {APP_NAME}
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300 border border-violet-500/30">
                v2.0
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => (
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Right CTA Actions (Auth Aware) */}
        <div className="hidden sm:flex items-center gap-2.5">
          {isAuth ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user ? getInitials(user.name) : "U"}
                </div>
                <span className="text-xs font-medium text-white/80 max-w-[120px] truncate">
                  {user?.name ?? "User"}
                </span>
              </div>
              <Button
                size="sm"
                variant="gradient"
                onClick={() => router.push(ROUTES.DASHBOARD)}
                className="flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Link href={ROUTES.LOGIN} className="flex items-center gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link href={ROUTES.REGISTER} className="flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" />
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-white/10 bg-[#0d0d15]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {isAuth ? (
                  <Button
                    variant="gradient"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(ROUTES.DASHBOARD);
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href={ROUTES.LOGIN} className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="gradient"
                      className="w-full justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href={ROUTES.REGISTER} className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Create Free Account
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
