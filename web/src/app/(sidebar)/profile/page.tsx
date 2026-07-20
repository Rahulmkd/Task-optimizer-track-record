"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Mail, Shield, Calendar, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials, formatDate } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-violet-400" />
          Profile
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Manage your personal information and account details.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center h-fit"
        >
          <div className="relative inline-block mb-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-violet-500/30">
              {user ? getInitials(user.name) : "U"}
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#0f0f18] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Edit2 className="h-3.5 w-3.5 text-white/60" />
            </button>
          </div>

          <h2 className="text-white font-semibold text-lg">{user?.name}</h2>
          <p className="text-white/40 text-sm mb-4">{user?.email}</p>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <Shield className="h-3 w-3" />
            Member
          </span>

          <div className="mt-6 pt-6 border-t border-white/5 text-left space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-white/30 shrink-0" />
              <span className="text-white/60 truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-white/30 shrink-0" />
              <span className="text-white/60">
                Joined {user?.createdAt ? formatDate(user.createdAt) : "—"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <h3 className="text-white font-semibold mb-1">
            Personal Information
          </h3>
          <p className="text-white/40 text-sm mb-6">
            Update your personal details here
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input defaultValue={user?.name} placeholder="Your full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input
                defaultValue={user?.email}
                type="email"
                placeholder="you@company.com"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label>Job title</Label>
              <Input placeholder="e.g. Software Engineer" />
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input placeholder="e.g. Acme Inc." />
            </div>
          </div>

          <div className="space-y-1.5 mb-6">
            <Label>Bio</Label>
            <textarea
              rows={4}
              placeholder="Tell us a bit about yourself..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button variant="gradient" onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-6"
      >
        <h3 className="text-red-400 font-semibold mb-1">Danger Zone</h3>
        <p className="text-white/40 text-sm mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <Button variant="destructive" size="sm">
          Delete account
        </Button>
      </motion.div>
    </DashboardShell>
  );
}
