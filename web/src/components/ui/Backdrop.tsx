"use client";

/* -------------------------------------------------------------------------- */
/*                          SHARED MODAL PRIMITIVES                           */
/* -------------------------------------------------------------------------- */
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const emptySubscribe = () => () => {};

export function Backdrop({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!isClient || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClick}
    >
      {children}
    </motion.div>,
    document.body,
  );
}
