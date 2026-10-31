"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { APP_NAME, ROUTES } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/auth.slice";
import { toast } from "sonner";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function DashboardNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await dispatch(logoutThunk());
    toast.success("Logged out successfully");
    router.replace(ROUTES.LOGIN);
  };

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0a0a0f]/85 backdrop-blur-xl flex items-center px-3.5 sm:px-6 gap-2.5 sm:gap-4 sticky top-0 z-30 transition-all">
      {/* Mobile menu toggle — opens the off-canvas sidebar drawer */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="md:hidden h-9 w-9 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer"
      >
        <Menu className="h-4 w-4 text-white/80" />
      </button>

      {/* Brand Logo */}
      <Link
        href={ROUTES.DASHBOARD}
        className="flex items-center gap-2.5 mr-1 sm:mr-4 group transition-opacity hover:opacity-90"
      >
        <Logo size="sm" priority />
        <span className="text-white font-bold text-sm tracking-tight hidden sm:flex items-center gap-1.5">
          {APP_NAME}
          <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/30 px-1.5 py-0.2 rounded-full">
            v2.0
          </span>
        </span>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 hover:border-white/20 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
        <Search className="h-4 w-4 text-white/40 shrink-0" />
        <input
          type="text"
          placeholder="Quick search (tasks, plans, analytics)..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
        <kbd className="text-[11px] font-medium text-white/30 border border-white/10 rounded-md px-1.5 py-0.5 bg-white/[0.02]">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Notifications Button */}
      <button
        aria-label="View notifications"
        className="relative h-9 w-9 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
        onClick={() => toast.info("No unread alerts at this time")}
      >
        <Bell className="h-4 w-4 text-white/70" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-[#0a0a0f]" />
      </button>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-2 sm:px-3 py-1.5 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
        >
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-violet-950/40">
            {user ? getInitials(user.name) : "U"}
          </div>
          <div className="hidden sm:block text-left max-w-[120px]">
            <p className="text-white text-xs font-semibold leading-tight truncate">
              {user?.name || "Account"}
            </p>
            <p className="text-white/40 text-[10px] truncate leading-tight">
              Active Member
            </p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-white/40 shrink-0" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/10 bg-[#0e0e16]/95 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden z-50 p-1.5"
            >
              <div className="p-3 border-b border-white/[0.06] mb-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-md bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-[10px] font-bold">
                    {user ? getInitials(user.name) : "U"}
                  </div>
                  <p className="text-white text-xs font-bold truncate">
                    {user?.name || "My Account"}
                  </p>
                </div>
                <p className="text-white/45 text-[11px] truncate">{user?.email}</p>
              </div>

              <div className="space-y-0.5">
                {[
                  { icon: User, label: "Profile Settings", href: ROUTES.PROFILE },
                  { icon: Settings, label: "App Preferences", href: ROUTES.SETTINGS },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push(item.href);
                    }}
                  >
                    <item.icon className="h-3.5 w-3.5 text-white/50" />
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="h-px bg-white/[0.06] my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
