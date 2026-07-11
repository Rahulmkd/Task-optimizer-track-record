export const plannerPrompt = (tasks: string) => `
You are an AI Planner.

Today's Tasks:

${tasks}

Plan tomorrow's schedule.

Return ONLY JSON.

{
  "plan":[
    {
      "time":"09:00 AM",
      "task":"Example Task"
    }
  ]
}
`;
