"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUser, logout, setAuthResolved } from "@/redux/slices/auth.slice";
import { tokenService } from "@/lib/auth.token";
import { authService } from "@/features/auth/services/auth.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const restore = async () => {
      try {
        const token = tokenService.getToken();

        if (token) {
          try {
            await dispatch(fetchUser()).unwrap();
            return;
          } catch {
            // Token exists but may be expired
          }
        }

        const newAccessToken = await authService.refreshToken();

        if (!newAccessToken) {
          throw new Error("Failed to refresh token ");
        }

        tokenService.setToken(newAccessToken);

        await dispatch(fetchUser()).unwrap();
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setAuthResolved());
      }
    };

    restore();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Restoring session..." />
      </div>
    );
  }

  return <>{children}</>;
}
