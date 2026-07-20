"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const settingSections = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Manage how you receive alerts and updates",
    items: [
      { label: "Email notifications", description: "Receive updates via email", enabled: true },
      { label: "Push notifications", description: "Get notified on your devices", enabled: true },
      { label: "Weekly digest", description: "A summary of your account activity", enabled: false },
      { label: "Security alerts", description: "Important security notifications", enabled: true },
    ],
  },
  {
    icon: Shield,
    title: "Security",
    description: "Control your account security preferences",
    items: [
      { label: "Two-factor authentication", description: "Add an extra layer of security", enabled: false },
      { label: "Login alerts", description: "Get notified of new sign-ins", enabled: true },
      { label: "Session timeout", description: "Auto sign-out after inactivity", enabled: true },
    ],
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Customize how NexusAuth looks for you",
    items: [
      { label: "Dark mode", description: "Use dark theme across the app", enabled: true },
      { label: "Reduced motion", description: "Minimize animations", enabled: false },
      { label: "Compact mode", description: "Show more content with less spacing", enabled: false },
    ],
  },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
        enabled ? "bg-violet-600" : "bg-white/10"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow-md"
      />
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
    toast.success("Settings saved successfully!");
  };

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-violet-400" />
            Settings
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage your account preferences and configuration.
          </p>
        </div>
        <Button variant="gradient" onClick={handleSave} className="group">
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </motion.div>

      <div className="space-y-6">
        {settings.map((section, sectionIdx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                <section.icon className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{section.title}</h3>
                <p className="text-white/40 text-sm">{section.description}</p>
              </div>
            </div>

            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <Label className="text-white/80 text-sm font-medium">{item.label}</Label>
                    <p className="text-white/35 text-xs mt-0.5">{item.description}</p>
                  </div>
                  <Toggle
                    enabled={item.enabled}
                    onChange={() => toggleItem(sectionIdx, itemIdx)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Language / Region */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Globe className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Language &amp; Region</h3>
              <p className="text-white/40 text-sm">Set your preferred language and timezone</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-white/60">Language</Label>
              <select className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60">Timezone</Label>
              <select className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>UTC+05:30 (India)</option>
                <option>UTC-08:00 (Pacific)</option>
                <option>UTC-05:00 (Eastern)</option>
                <option>UTC+00:00 (GMT)</option>
                <option>UTC+01:00 (Central Europe)</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
