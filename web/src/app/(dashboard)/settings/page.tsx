"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/constants/constants";

const settingSections = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Manage how you receive alerts, daily reminders, and sprint updates",
    items: [
      { label: "Email notifications", description: "Receive daily digest and weekly reports via email", enabled: true },
      { label: "Push notifications", description: "Get real-time task countdowns on your devices", enabled: true },
      { label: "Weekly digest", description: "A high-level summary of your sprint productivity", enabled: false },
      { label: "Security alerts", description: "Notifications for new logins and session revocations", enabled: true },
    ],
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Control your account authentication and session lifecycle",
    items: [
      { label: "Two-factor authentication", description: "Add multi-factor verification to your sign-in", enabled: false },
      { label: "Login activity alerts", description: "Get notified when a new device signs in", enabled: true },
      { label: "Session idle timeout", description: "Automatically sign out after 30 minutes of inactivity", enabled: true },
    ],
  },
  {
    icon: Palette,
    title: "Appearance & Interface",
    description: `Customize how ${APP_NAME} displays on your screens`,
    items: [
      { label: "Dark theme", description: "High-contrast dark mode with ambient violet backdrops", enabled: true },
      { label: "Reduced motion", description: "Minimize non-essential UI animations and transitions", enabled: false },
      { label: "Compact timeblock view", description: "Display more timetable items per viewport", enabled: false },
    ],
  },
];

function Toggle({
  enabled,
  onChange,
  ariaLabel,
}: {
  enabled: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
        enabled ? "bg-violet-600" : "bg-white/10 hover:bg-white/15"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow-md flex items-center justify-center"
      >
        {enabled && <Check className="h-3 w-3 text-violet-600 stroke-[3]" />}
      </motion.div>
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(
    settingSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({ ...item })),
    }))
  );

  const toggleItem = (sectionIdx: number, itemIdx: number) => {
    setSettings((prev) =>
      prev.map((section, si) =>
        si === sectionIdx
          ? {
              ...section,
              items: section.items.map((item, ii) =>
                ii === itemIdx ? { ...item, enabled: !item.enabled } : item
              ),
            }
          : section
      )
    );
  };

  const handleSave = () => {
    toast.success("Preferences saved successfully!");
  };

  return (
    <DashboardShell>
      <div className="space-y-6 sm:space-y-7">
        {/* ── Top Header ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-7 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/25 via-white/[0.02] to-transparent backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                <SettingsIcon className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Application Settings &amp; Preferences
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-white/50 max-w-xl">
              Configure notifications, security policies, interface display, and regional time settings.
            </p>
          </div>

          <div className="relative z-10 shrink-0 self-start sm:self-auto">
            <Button variant="gradient" size="lg" onClick={handleSave} className="shadow-lg shadow-violet-950/40">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>

        {/* ── Settings Sections ─────────────────────────────────── */}
        <div className="space-y-5">
          {settings.map((section, sectionIdx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.06, ease: "easeOut" }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.06]">
                <div className="h-9 w-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <section.icon className="h-4.5 w-4.5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{section.title}</h3>
                  <p className="text-xs text-white/50">{section.description}</p>
                </div>
              </div>

              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3.5 border-b border-white/[0.04] last:border-0 gap-4"
                  >
                    <div>
                      <Label className="text-white/85 text-xs sm:text-sm font-semibold">{item.label}</Label>
                      <p className="text-white/45 text-xs mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                    <Toggle
                      enabled={item.enabled}
                      ariaLabel={item.label}
                      onChange={() => toggleItem(sectionIdx, itemIdx)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Language & Regional Settings */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.06]">
              <div className="h-9 w-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Globe className="h-4.5 w-4.5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Language &amp; Region</h3>
                <p className="text-xs text-white/50">Configure your locale, language dialect, and time boundaries</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pref-language" className="text-xs font-semibold text-white/70">Preferred Language</Label>
                <div className="relative flex items-center">
                  <select
                    id="pref-language"
                    defaultValue="English (US)"
                    className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 cursor-pointer appearance-none [&>option]:bg-[#0e0e16] [&>option]:text-white"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-white/40 absolute right-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pref-timezone" className="text-xs font-semibold text-white/70">Timezone &amp; Day Boundary</Label>
                <div className="relative flex items-center">
                  <select
                    id="pref-timezone"
                    defaultValue="UTC+05:30 (India Standard Time - IST)"
                    className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 cursor-pointer appearance-none [&>option]:bg-[#0e0e16] [&>option]:text-white"
                  >
                    <option value="UTC+05:30 (India Standard Time - IST)">UTC+05:30 (India Standard Time - IST)</option>
                    <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
                    <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                    <option value="UTC+00:00 (GMT / UTC)">UTC+00:00 (GMT / UTC)</option>
                    <option value="UTC+01:00 (Central European Time)">UTC+01:00 (Central European Time)</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-white/40 absolute right-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
