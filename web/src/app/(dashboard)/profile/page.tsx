"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  ProfileHeader,
  ProfileOverviewCard,
  ProfileEditForm,
  DangerZoneCard,
  DeleteAccountModal,
  ProfileSkeleton,
} from "@/features/users";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUser } from "@/redux/slices/auth.slice";

export default function ProfilePage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only fetch if authenticated and user is missing
    if (isAuthenticated && !user && !isLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, user, isLoading]);

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <ProfileHeader />

        {isLoading && !user ? (
          <ProfileSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Profile Overview Card (Left 1 Col) */}
              <div className="lg:col-span-1">
                <ProfileOverviewCard user={user} />
              </div>

              {/* Edit Information Form (Right 2 Cols) */}
              <div className="lg:col-span-2">
                <ProfileEditForm user={user} />
              </div>
            </div>

            {/* Danger Zone */}
            <DangerZoneCard
              onOpenDeleteModal={() => setDeleteModalOpen(true)}
            />
          </>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteAccountModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          user={user}
        />
      </motion.div>
    </DashboardShell>
  );
}
