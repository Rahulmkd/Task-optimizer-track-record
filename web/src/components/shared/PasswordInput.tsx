"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { InputProps } from "@/components/ui/input";

interface PasswordInputProps extends Omit<InputProps, "type"> {
  showStrength?: boolean;
  value?: string;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Very Weak", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Weak", color: "bg-orange-500" };
  if (score === 3) return { score: 3, label: "Fair", color: "bg-yellow-500" };
  if (score === 4) return { score: 4, label: "Strong", color: "bg-green-400" };
  return { score: 5, label: "Very Strong", color: "bg-emerald-400" };
}

export function PasswordInput({ showStrength, value = "", className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrength && value && strength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  i < strength.score ? strength.color : "bg-white/10"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-white/40">
            Strength: <span className="text-white/70">{strength.label}</span>
          </p>
        </div>
      )}
    </div>
  );
}
