"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/home/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/home/journal", icon: ScrollText, label: "Journals" },
  { href: "/home/settings", icon: Settings, label: "Settings" },
  { href: "/home/profile", icon: User, label: "Profile" },
];

const bottomItems = [
  { href: "#", icon: Shield, label: "Security" },
  { href: "#", icon: Bell, label: "Notifications" },
  { href: "#", icon: HelpCircle, label: "Help" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-full border-r border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl relative shrink-0"
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-white/10 bg-[#0a0a0f] flex items-center justify-center z-10 hover:bg-white/10 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-white/50" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-white/50" />
        )}
      </button>

      {/* Main nav */}
      <nav className="flex-1 p-3 space-y-1 mt-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </motion.aside>
  );
}
