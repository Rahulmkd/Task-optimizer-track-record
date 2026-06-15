"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { StoreProvider } from "@/redux/provider";

interface AppProviderProps {
  children: React.ReactNode;
}

function AppContent({ children }: AppProviderProps) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "rgba(15, 15, 25, 0.95)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </>
  );
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <StoreProvider>
      <AppContent>{children}</AppContent>
    </StoreProvider>
  );
}
