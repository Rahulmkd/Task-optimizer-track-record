import { AppError } from "../../utils/AppError.js";
import { AIMapper } from "./ai.mapper.js";
import { JournalAIResponse } from "./ai.interface.js";
import { JsonParser } from "./parsers/json.parser.js";
import { journalPrompt } from "./prompts/journal.prompt.js";
import { TaskFormatter } from "./utils/taskFormatter.js";
import aiProvider from "./providers/index.js";
import aiRepository from "./ai.repository.js";

/**
 * AIService — orchestrates journal generation and retrieval.
 *
 * generateJournal pipeline:
 *  1. Fetch today's tasks from the database
 *  2. Format them into readable plain text
 *  3. Build the prompt and call the AI provider
 *  4. Parse the AI's JSON response
 *  5. Persist the analysis (excluding the transient suggestion)
 *  6. Return the full DTO with suggestion for this response
 *
 * getAllJournals:
 *  - Returns the user's full journal history, newest first
 *  - suggestion is null for history records (never persisted)
 */
class AIService {
  async generateJournal(userId: string) {
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

    // const journal = await aiRepository.createJournal({
    //   userId,
    //   summary: parsed.summary,
    //   completedTasks: parsed.completedTasks,
    //   pendingTasks: parsed.pendingTasks,
    //   productivityScore: parsed.productivityScore,
    // });

    // return AIMapper.toResponse(journal, parsed.suggestion);

    return {
      summary: parsed.summary,
      completedTasks: parsed.completedTasks,
      pendingTasks: parsed.pendingTasks,
      productivityScore: parsed.productivityScore,
      suggestion: parsed.suggestion,
    };
  }

  async saveJournal(
    userId: string,
    data: {
      summary: string;
      completedTasks: number;
      pendingTasks: number;
      productivityScore: number;
    },
  ) {
    const journal = await aiRepository.createJournal({
      userId,
      ...data,
    });

    return AIMapper.toResponse(journal);
  }

  /**
   * Fetches all journal entries for the user, newest first.
   */
  async getAllJournals(userId: string) {
    const journals = await aiRepository.getAllJournals(userId);
    return AIMapper.toListResponse(journals);
  }
}

export default new AIService();
