/**
 * Prompt for AI Weekly Plan Generation.
 * Analyzes the user's lifestyle, routine, working hours, habits, and goals
 * to produce a balanced, realistic, structured Monday–Sunday timetable.
 */
export const weeklyPlannerPrompt = (
  routineContext: string,
  instructions?: string,
): string => `
You are an expert Productivity Architect and Schedule Planner.
Analyze the user's routine, goals, lifestyle, working hours, and constraints to generate a realistic, structured weekly timetable.

--- USER ROUTINE & LIFESTYLE ---
${routineContext}
--- END USER ROUTINE ---

${
  instructions && instructions.trim().length > 0
    ? `--- ADDITIONAL CONSTRAINTS & INSTRUCTIONS ---
${instructions.trim()}
--- END ADDITIONAL CONSTRAINTS ---`
    : ""
}

Generate a realistic, balanced timetable with distinct schedules for:
1. Monday–Friday (core weekday routine: wake up, study/DSA, work/job, gym/exercise, evening wind-down, sleep)
2. Saturday (weekend deep work, projects, fitness, leisure, errands)
3. Sunday (rest, weekly review, planning, light learning, relaxation)
4. Study or focus rotation recommendations (daily or weekly topic schedule)

Return ONLY a single valid JSON object matching this exact structure (no markdown fences, no explanatory text):

{
  "summary": "2-3 sentences explaining the weekly strategy, work-life balance, and priority alignment.",
  "studyRotation": "A concise daily or weekly topic rotation (e.g. Mon/Wed: DSA Dynamic Programming; Tue/Thu: System Design & APIs; Sat: Coding Contest & Review).",
  "weekdaySchedule": [
    {
      "title": "Wake up and get ready",
      "description": "Hydrate, morning stretch, and breakfast",
      "startTime": "06:00 AM",
      "endTime": "06:30 AM",
      "duration": 30,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    },
    {
      "title": "DSA Practice",
      "description": "Solve 2 LeetCode medium problems and review concepts",
      "startTime": "06:30 AM",
      "endTime": "08:30 AM",
      "duration": 120,
      "category": "DSA",
      "priority": "HIGH",
      "repeatWeekly": true
    },
    {
      "title": "Job / Work Hours",
      "description": "Core professional work and project delivery",
      "startTime": "09:00 AM",
      "endTime": "06:00 PM",
      "duration": 540,
      "category": "Job",
      "priority": "HIGH",
      "repeatWeekly": true
    },
    {
      "title": "Gym & Workout",
      "description": "Strength training and cardio session",
      "startTime": "06:30 PM",
      "endTime": "08:15 PM",
      "duration": 105,
      "category": "Gym",
      "priority": "MEDIUM",
      "repeatWeekly": true
    },
    {
      "title": "Evening Preparation & Dinner",
      "description": "Dinner, personal reading, and day review",
      "startTime": "09:00 PM",
      "endTime": "11:00 PM",
      "duration": 120,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    },
    {
      "title": "Sleep & Recovery",
      "description": "7 hours of restorative sleep",
      "startTime": "11:00 PM",
      "endTime": "06:00 AM",
      "duration": 420,
      "category": "Personal",
      "priority": "HIGH",
      "repeatWeekly": true
    }
  ],
  "saturdaySchedule": [
    {
      "title": "Morning Routine & Breakfast",
      "description": "Relaxed morning start and healthy breakfast",
      "startTime": "07:30 AM",
      "endTime": "08:30 AM",
      "duration": 60,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    },
    {
      "title": "Deep Work / Side Project",
      "description": "Feature development or portfolio building",
      "startTime": "09:00 AM",
      "endTime": "01:00 PM",
      "duration": 240,
      "category": "Study",
      "priority": "HIGH",
      "repeatWeekly": true
    },
    {
      "title": "Lunch & Social / Free Time",
      "description": "Relaxation and leisure",
      "startTime": "01:00 PM",
      "endTime": "03:30 PM",
      "duration": 150,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    },
    {
      "title": "Outdoor Activity or Workout",
      "description": "Run, sports, or gym session",
      "startTime": "04:30 PM",
      "endTime": "06:30 PM",
      "duration": 120,
      "category": "Gym",
      "priority": "MEDIUM",
      "repeatWeekly": true
    },
    {
      "title": "Wind Down & Sleep",
      "description": "Rest and sleep",
      "startTime": "11:00 PM",
      "endTime": "07:30 AM",
      "duration": 510,
      "category": "Personal",
      "priority": "HIGH",
      "repeatWeekly": true
    }
  ],
  "sundaySchedule": [
    {
      "title": "Morning Routine & Reflection",
      "description": "Calm start to Sunday",
      "startTime": "08:00 AM",
      "endTime": "09:00 AM",
      "duration": 60,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    },
    {
      "title": "Weekly Planning & Review",
      "description": "Review progress and set up the coming week",
      "startTime": "10:00 AM",
      "endTime": "11:30 AM",
      "duration": 90,
      "category": "Personal",
      "priority": "HIGH",
      "repeatWeekly": true
    },
    {
      "title": "Light Study / Reading",
      "description": "Articles, tech documentation, or book reading",
      "startTime": "02:00 PM",
      "endTime": "04:00 PM",
      "duration": 120,
      "category": "Study",
      "priority": "MEDIUM",
      "repeatWeekly": true
    },
    {
      "title": "Family, Dinner & Rest",
      "description": "Quality time and relaxation",
      "startTime": "05:00 PM",
      "endTime": "09:30 PM",
      "duration": 270,
      "category": "Personal",
      "priority": "LOW",
      "repeatWeekly": true
    },
    {
      "title": "Early Sleep for Monday Ready",
      "description": "Ensure energy for Monday morning",
      "startTime": "10:30 PM",
      "endTime": "06:00 AM",
      "duration": 450,
      "category": "Personal",
      "priority": "HIGH",
      "repeatWeekly": true
    }
  ]
}

Guidelines:
- All times MUST be valid 12-hour AM/PM format, e.g. "06:00 AM", "09:30 PM".
- duration must be positive minutes matching the difference between startTime and endTime.
- priority must be strictly one of: "HIGH", "MEDIUM", "LOW".
- categories should reflect the activity: "DSA", "Job", "Gym", "Study", "Personal", "Health", "Career", etc.
- repeatWeekly should typically be true.
- Output ONLY the single JSON object. No backticks, no markdown, no intro/outro.
`;
