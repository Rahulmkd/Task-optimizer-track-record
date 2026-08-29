export function formatProgressDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatProgressFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getProgressScoreColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-violet-400";

  return "text-red-400";
}

export function getProgressScoreBackground(score: number): string {
  if (score >= 75) return "bg-emerald-400";
  if (score >= 50) return "bg-violet-400";

  return "bg-red-400";
}

export function getProgressScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 50) return "On track";

  return "Needs focus";
}

export function calculateCompletionRate(
  completed: number,
  pending: number,
): number {
  const total = completed + pending;

  if (!total) return 0;

  return Math.round((completed / total) * 100);
}
