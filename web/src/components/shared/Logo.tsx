import Image from "next/image";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/constants";

export interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-xl",
  md: "h-9 w-9 rounded-xl",
  lg: "h-12 w-12 rounded-2xl",
  xl: "h-16 w-16 rounded-2xl",
};

const dimensionMap = {
  sm: 32,
  md: 36,
  lg: 48,
  xl: 64,
};

export function Logo({ size = "sm", className, priority = false }: LogoProps) {
  const dim = dimensionMap[size];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-hidden shadow-md shadow-violet-950/40 transition-transform group-hover:scale-105 border border-white/10 bg-[#060313]",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src="/logo.png"
        alt={`${APP_NAME} Logo`}
        width={dim}
        height={dim}
        className="h-full w-full object-cover"
        priority={priority}
      />
    </div>
  );
}
