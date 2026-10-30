"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white resize-y",
          "placeholder:text-white/35",
          "focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/60",
          "hover:border-white/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          "backdrop-blur-sm",
          error && "border-red-500/60 focus:ring-red-500/40 focus:border-red-500",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
