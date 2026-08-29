export function formatStoryDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatStoryTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStoryScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";

  return "Needs work";
}

export function getStoryScoreRingColor(score: number): string {
  if (score >= 75) return "#34d399";
  if (score >= 50) return "#a78bfa";

  return "#f87171";
}
