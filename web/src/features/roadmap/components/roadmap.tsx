"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/constants";

export function Roadmapsh() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(ROUTES.ROADMAP);
  };

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <button
        type="button"
        onClick={handleRedirect}
        className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
      >
        Go to Roadmaps
      </button>
    </div>
  );
}