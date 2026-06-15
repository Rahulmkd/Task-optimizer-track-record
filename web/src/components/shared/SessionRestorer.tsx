"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function SessionRestorer() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return null;
}
