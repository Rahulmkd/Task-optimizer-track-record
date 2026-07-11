/**
 * Builds the prompt sent to the AI provider for daily journal generation.
 *
 * @param tasks - Formatted plain-text task list produced by TaskFormatter.
 */
export const journalPrompt = (tasks: string): string => `
You are an AI Productivity Coach. Analyse the user's tasks below and return a structured daily journal.

--- TASKS ---
${tasks}
--- END TASKS ---

Return ONLY a single valid JSON object matching this exact shape (no markdown, no prose, no comments):

{
  "summary": "string (2–3 sentences summarising how the day went)",
  "completedTasks": number,
  "pendingTasks": number,
  "productivityScore": number,
  "suggestion": "string (one concrete, actionable tip for improving tomorrow)"
}

Rules:
- productivityScore must be an integer between 0 and 100.
- completedTasks and pendingTasks must be non-negative integers.
- summary must be 2–3 sentences, written in second person ("You completed…").
- suggestion must be a single sentence that is specific and actionable.
- Output ONLY the JSON object — no explanation, no markdown fences, no trailing text.
`;
