"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  className,
  children,
  id,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-1">
          {label}
          {required && <span className="text-violet-400">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 animate-fade-in">
          <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-white/40">{hint}</p>
      )}
    </div>
  );
}
