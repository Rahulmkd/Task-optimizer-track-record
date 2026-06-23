"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUser, logout, setAuthResolved } from "@/redux/slices/auth.slice";
import { tokenService } from "@/lib/auth.token";
import { authService } from "@/features/auth/services/auth.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/constants";

const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER];

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const pathname = usePathname();
  const ran = useRef(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(
    pathname as (typeof PUBLIC_ROUTES)[number],
  );

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
            // In-memory token present but stale — fall through to cookie refresh
          }
        }

        const newAccessToken = await authService.refreshToken();

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh");
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

  // Public routes render immediately — session restore is silent/background.
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Restoring session..." />
      </div>
    );
  }

  return <>{children}</>;
}
