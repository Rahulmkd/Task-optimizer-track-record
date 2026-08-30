
"use client";

import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { store } from "@/redux/store";
import { AuthInitializer } from "./AuthInitializer";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Provider store={store}>
      <AuthInitializer>
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
      </AuthInitializer>
    </Provider>
  );
}
