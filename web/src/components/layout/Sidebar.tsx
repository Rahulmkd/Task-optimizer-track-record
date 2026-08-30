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
  Bell,
  HelpCircle,
  ScrollText,
  X,
  Zap,
  ListTodo,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/constants";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: ListTodo, label: "My Tasks" },
  { href: "/roadmap", icon: Map, label: "Roadmap" },
  { href: "/progress", icon: BarChart3, label: "Progress" },
  { href: "/story", icon: ScrollText, label: "My Story" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/profile", icon: User, label: "Profile" },
];

const bottomItems = [
  { href: "#", icon: Shield, label: "Security" },
  { href: "#", icon: Bell, label: "Notifications" },
  { href: "#", icon: HelpCircle, label: "Help" },
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
    <>
      {/* Main nav */}
      <nav className="flex-1 p-3 space-y-1 mt-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group",
                active
                  ? "bg-violet-500/15 text-violet-300 border-l-2 border-violet-500"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5",
              )}
            >
              <item.icon
                className={cn("h-4 w-4 shrink-0", active && "text-violet-400")}
              />
              <motion.span
                animate={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                }}
                className="overflow-hidden whitespace-nowrap font-medium"
              >
                {item.label}
              </motion.span>
              {active && !collapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="p-3 border-t border-white/5 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <item.icon className="h-4 w-4 shrink-0" />
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
    </>
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
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-full border-r border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl relative shrink-0"
      >
        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-white/10 bg-[#0a0a0f] flex items-center justify-center z-10 hover:bg-white/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-white/50" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-white/50" />
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
              className="md:hidden fixed inset-0 bg-black/65 backdrop-blur-sm z-40"
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
              className="md:hidden fixed inset-y-0 left-0 z-50 flex w-[78vw] max-w-[280px] flex-col border-r border-white/10 bg-[#0a0a0f] shadow-[0_0_64px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {APP_NAME}
                  </span>
                </div>

                <button
                  onClick={onMobileClose}
                  aria-label="Close menu"
                  className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-white/60" />
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
