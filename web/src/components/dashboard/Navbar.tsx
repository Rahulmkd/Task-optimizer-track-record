"use client";

import { useState } from "react";
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
  Zap,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { APP_NAME, ROUTES } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/auth.slice";
import { toast } from "sonner";

export function DashboardNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await dispatch(logoutThunk());
    toast.success("Logged out successfully");
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center px-3 sm:px-6 gap-2 sm:gap-4 sticky top-0 z-30">
      {/* Mobile menu toggle — opens the off-canvas sidebar drawer */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="md:hidden h-9 w-9 shrink-0 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <Menu className="h-4 w-4 text-white/70" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-1 sm:mr-4">
        <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-white font-semibold text-sm hidden sm:block">
          {APP_NAME}
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
        <Search className="h-4 w-4 text-white/30" />
        <input
          type="text"
          placeholder="Search anything..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        <kbd className="text-xs text-white/20 border border-white/10 rounded px-1.5 py-0.5">
          ⌘
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative h-9 w-9 shrink-0 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Bell className="h-4 w-4 text-white/60" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500" />
      </button>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 sm:gap-2.5 rounded-lg border border-white/10 bg-white/5 px-2 sm:px-3 py-2 hover:bg-white/10 transition-colors"
        >
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user ? getInitials(user.name) : "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-white text-xs font-medium leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-white/40 text-xs mt-0.5">Admin</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-white/40" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-52 max-w-[calc(100vw-1.5rem)] rounded-xl border border-white/10 bg-[#0f0f18] backdrop-blur-xl shadow-xl overflow-hidden z-50"
            >
              <div className="p-3 border-b border-white/5">
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-white/40 text-xs truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                {[
                  { icon: User, label: "Profile" },
                  { icon: Settings, label: "Settings" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
