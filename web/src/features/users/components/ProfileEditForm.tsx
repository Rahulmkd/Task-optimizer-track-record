"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Phone,
  Save,
  RotateCcw,
  Loader2,
  Lock,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from "@/features/auth/schemas/auth.schema";
import { IUser } from "@/features/auth/types/user.types";
import { useAppDispatch } from "@/redux/hooks";
import { updateProfileThunk } from "@/redux/slices/auth.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";

interface ProfileEditFormProps {
  user: IUser | null;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // Re-sync form when user data loads or updates
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    clearErrors("root");
    try {
      const updated = await dispatch(
        updateProfileThunk({
          name: data.name.trim(),
          phoneNumber: data.phoneNumber.trim(),
        }),
      ).unwrap();

      reset({
        name: updated.name,
        phoneNumber: updated.phoneNumber || "",
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Failed to update profile";

      toast.error(message);
      setError("root", {
        type: "server",
        message,
      });
    }
  };

  const handleDiscard = () => {
    if (user) {
      reset({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
      });
      clearErrors();
      toast.info("Changes discarded");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 relative"
    >
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/5">
        <div>
          <h3 className="text-white font-semibold text-lg">
            Personal Information
          </h3>
          <p className="text-white/40 text-sm mt-0.5">
            Update your public profile and verified contact details.
          </p>
        </div>

        {isDirty && (
          <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full animate-pulse">
            Unsaved changes
          </span>
        )}
      </div>

      {errors.root?.message && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {errors.root.message}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <FormField
            id="profile-name"
            label="Full Name"
            required
            error={errors.name?.message}
          >
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                id="profile-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className="pl-9"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
          </FormField>

          {/* Phone Number */}
          <FormField
            id="profile-phone"
            label="Phone Number"
            required
            error={errors.phoneNumber?.message}
          >
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                id="profile-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1234567890"
                className="pl-9"
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
              />
            </div>
          </FormField>
        </div>

        {/* Email Address (Read-only) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-white/80">
              Email Address
            </label>
            <span className="flex items-center gap-1 text-[11px] text-white/40">
              <Lock className="h-3 w-3" /> Primary Login ID (Non-editable)
            </span>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              id="profile-email"
              type="email"
              value={user?.email || ""}
              disabled
              readOnly
              className="pl-9 bg-white/[0.02] border-white/5 text-white/50 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/35 pt-1">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>To update your login email, please contact customer support.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            disabled={!isDirty || isSubmitting}
            className="border-white/10 hover:bg-white/5"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Discard
          </Button>

          <Button
            type="submit"
            variant="gradient"
            disabled={!isDirty || isSubmitting}
            className="min-w-[130px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save changes
              </span>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
