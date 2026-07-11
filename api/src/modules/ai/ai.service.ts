import { AppError } from "../../utils/AppError.js";
import { AIMapper } from "./ai.mapper.js";
import { JournalAIResponse } from "./ai.interface.js";
import { JsonParser } from "./parsers/json.parser.js";
import { journalPrompt } from "./prompts/journal.prompt.js";
import { TaskFormatter } from "./utils/taskFormatter.js";
import aiProvider from "./providers/index.js";
import aiRepository from "./ai.repository.js";

/**
 * AIService orchestrates the journal-generation pipeline:
 *
 *  1. Fetch today's tasks from the database.
 *  2. Format them into readable plain text for the prompt.
 *  3. Build the prompt and send it to the active AI provider.
 *  4. Parse the AI's JSON response into a typed structure.
 *  5. Persist the analysis (minus the transient suggestion) to the Journal table.
 *  6. Return the full DTO including the suggestion for this response.

 */
class AIService {
  async generateJournal(userId: string) {
    // 1. Load today's tasks
    const tasks = await aiRepository.getTodayTasks(userId);

    if (!tasks.length) {
      throw new AppError(
        "No tasks found for today. Add some tasks first before generating a summary.",
        404,
      );
    }

    const formattedTasks = TaskFormatter.format(tasks);

    const prompt = journalPrompt(formattedTasks);

    const aiResponse = await aiProvider.invoke(prompt);

    const parsed = JsonParser.parse(
      aiResponse.content.toString(),
    ) as JournalAIResponse;

    const journal = await aiRepository.createJournal({
      userId,
      summary: parsed.summary,
      completedTasks: parsed.completedTasks,
      pendingTasks: parsed.pendingTasks,
      productivityScore: parsed.productivityScore,
    });

    return AIMapper.toResponse(journal, parsed.suggestion);
  }

  async getAllJournals(userId: string) {
    const journals = await aiRepository.getAllJournals(userId);
    return AIMapper.toListResponse(journals);
  }
}

export default new AIService();
