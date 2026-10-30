/**
 * Optimized Prompt for AI Weekly Plan Generation.
 * Produces structured, realistic, non-overlapping weekly timetables fast.
 */
export const weeklyPlannerPrompt = (
  routineContext: string,
  instructions?: string,
): string => `
You are an expert Productivity Architect.
Analyze the user's routine, goals, work hours, habits, and commitments to generate a realistic, high-impact weekly schedule.

USER ROUTINE & LIFESTYLE:
${routineContext}

${
  instructions && instructions.trim().length > 0
    ? `SPECIAL CONSTRAINTS & INSTRUCTIONS:
${instructions.trim()}
`
    : ""
}
Create a balanced schedule with:
1. "weekdaySchedule": 5-7 core anchor tasks for Monday-Friday (wake up, focus/study/DSA, work/college, workout/gym, dinner/wind-down, sleep).
2. "saturdaySchedule": 4-5 tasks for Saturday (morning start, deep work/projects, leisure/social, workout, sleep).
3. "sundaySchedule": 4-5 tasks for Sunday (reflection, weekly planning, light study, family/relaxation, sleep).
4. "studyRotation": 1 concise sentence of topic rotation (e.g., "Mon/Wed: DSA DP & Trees; Tue/Thu: System Design; Sat: Contests").
5. "summary": 2 concise sentences explaining the weekly strategy.

Return ONLY a single valid JSON object. No markdown fences. No extra text:
{
  "summary": "Concise 2-sentence strategy.",
  "studyRotation": "Concise topic rotation.",
  "weekdaySchedule": [
    {
      "title": "Task title",
      "description": "Brief description",
      "startTime": "06:00 AM",
      "endTime": "06:30 AM",
      "duration": 30,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    }
  ],
  "saturdaySchedule": [
    {
      "title": "Task title",
      "description": "Brief description",
      "startTime": "08:00 AM",
      "endTime": "09:00 AM",
      "duration": 60,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    }
  ],
  "sundaySchedule": [
    {
      "title": "Task title",
      "description": "Brief description",
      "startTime": "08:30 AM",
      "endTime": "09:30 AM",
      "duration": 60,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    }
  ]
}

RULES:
- All times must be in "HH:MM AM" or "HH:MM PM" format (e.g. "06:30 AM", "09:00 PM").
- duration is integer minutes between startTime and endTime.
- priority must be "HIGH", "MEDIUM", or "LOW".
- categories: "DSA", "Job", "Gym", "Study", "Personal", "Health", "Work".
- Output ONLY valid JSON.
`;
