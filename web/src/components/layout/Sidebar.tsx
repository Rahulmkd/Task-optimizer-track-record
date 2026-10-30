"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  ScrollText,
  X,
  Zap,
  ListTodo,
  CalendarRange,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, ROUTES } from "@/constants/constants";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/my-task", icon: ListTodo, label: "My Tasks" },
  { href: "/weekly-tasks", icon: CalendarRange, label: "Weekly Tasks" },
  { href: "/roadmap", icon: Map, label: "Roadmap" },
  { href: "/progress", icon: BarChart3, label: "Progress" },
  { href: "/story", icon: ScrollText, label: "My Story" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/profile", icon: User, label: "Profile" },
];

const bottomItems = [
  { href: ROUTES.SETTINGS, icon: Shield, label: "Security & Privacy" },
  { href: ROUTES.PROFILE, icon: User, label: "Account Overview" },
];

/* -------------------------------------------------------------------------- */
/*                        SHARED NAV LIST (desktop + mobile)                  */
/* -------------------------------------------------------------------------- */

function NavList({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full justify-between overflow-y-auto custom-scrollbar">
      {/* Main nav */}
      <nav className="p-3 space-y-1.5 mt-2">
        <div className={cn("px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/35", collapsed && "sr-only")}>
          Workspace
        </div>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-violet-600/15 text-white border border-violet-500/30 shadow-sm shadow-violet-950/30 font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06]",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-violet-400" : "text-white/50 group-hover:text-white/80"
                )}
              />
              <motion.span
                animate={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
              {active && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="p-3 border-t border-white/[0.06] space-y-1 mt-auto">
        <div className={cn("px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/30", collapsed && "sr-only")}>
          Support
        </div>
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-white/45 hover:text-white/80 hover:bg-white/[0.05] transition-all"
          >
            <item.icon className="h-4 w-4 shrink-0 text-white/40" />
            <motion.span
              animate={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
              }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   SIDEBAR                                  */
/* -------------------------------------------------------------------------- */

interface SidebarProps {
  /** Controls the off-canvas drawer on mobile (< md). Ignored on desktop. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Auto-close the mobile drawer whenever the route changes.
  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen, onMobileClose]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop: collapsible inline sidebar (md and up) ───────────── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 236 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-full border-r border-white/[0.08] bg-[#0a0a0f]/90 backdrop-blur-xl relative shrink-0 z-20"
      >
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-5 h-6 w-6 rounded-full border border-white/10 bg-[#0e0e16] flex items-center justify-center z-30 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-md text-white/60 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        <NavList collapsed={collapsed} />
      </motion.aside>

      {/* ── Mobile: off-canvas drawer (below md) ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
              onClick={onMobileClose}
              aria-hidden
            />

            <motion.aside
              key="sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="md:hidden fixed inset-y-0 left-0 z-50 flex w-[82vw] max-w-[280px] flex-col border-r border-white/10 bg-[#0a0a0f] shadow-2xl shadow-black"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.08] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-950/40">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight">
                    {APP_NAME}
                  </span>
                </div>

                <button
                  onClick={onMobileClose}
                  aria-label="Close menu"
                  className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors cursor-pointer text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <NavList collapsed={false} onNavigate={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
