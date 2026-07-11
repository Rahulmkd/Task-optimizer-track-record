export const summaryPrompt = (tasks: string) => `
You are an expert task summarizer.

Tasks:

${tasks}

Generate a concise summary.

Return ONLY JSON.

{
  "summary":"string"
}
`;
