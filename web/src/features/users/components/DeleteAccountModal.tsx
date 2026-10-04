"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Backdrop } from "@/components/ui/Backdrop";
import { ModalPanel } from "@/components/ui/ModalPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";
import { deleteAccountThunk } from "@/redux/slices/auth.slice";
import { ROUTES } from "@/constants/constants";
import { IUser } from "@/features/auth/types/user.types";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  user,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const isConfirmed = confirmText.trim().toUpperCase() === "DELETE";

  const handleClose = () => {
    if (isDeleting) return;
    setConfirmText("");
    setErrorMessage(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!isConfirmed || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await dispatch(deleteAccountThunk()).unwrap();
      toast.success("Your account and all associated data have been deleted.");
      setIsDeleting(false);
      setConfirmText("");
      onClose();
      router.replace(ROUTES.LOGIN);
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Failed to delete account. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop onClick={handleClose}>
          <ModalPanel>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Delete Account
                    </h3>
                    <p className="text-white/40 text-xs">
                      Permanent and irreversible action
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isDeleting}
                  aria-label="Close"
                  className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Warning Content */}
              <div className="space-y-3 text-sm text-white/70 bg-red-500/[0.06] border border-red-500/20 rounded-xl p-4 mb-5">
                <p className="font-medium text-red-300">
                  Are you absolutely sure you want to delete your account?
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  This will permanently delete the account for{" "}
                  <strong className="text-white font-semibold">
                    {user?.email || "this user"}
                  </strong>
                  . All associated tasks, weekly schedules, actions, journals, and
                  session tokens will be wiped out from the database immediately.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  {errorMessage}
                </div>
              )}

              {/* Confirmation Input */}
              <div className="space-y-2 mb-6">
                <label
                  htmlFor="delete-confirm-input"
                  className="block text-xs font-medium text-white/80"
                >
                  To confirm, type <span className="font-bold text-red-400 font-mono tracking-wider">DELETE</span> below:
                </label>
                <Input
                  id="delete-confirm-input"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  disabled={isDeleting}
                  className="border-red-500/30 focus:border-red-500 focus:ring-red-500/30"
                  autoComplete="off"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={!isConfirmed || isDeleting}
                  className="min-w-[140px]"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </ModalPanel>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
