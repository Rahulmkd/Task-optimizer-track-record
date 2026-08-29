import { AppError } from "../../utils/AppError.js";
import { AIMapper } from "./ai.mapper.js";
import { journalAIResponseSchema, SaveJournalDTO } from "./ai.schema.js";
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
 *  4. Parse and validate the AI's JSON response against journalAIResponseSchema
 *  5. Return the result to the client — nothing is persisted here
 *
 * Persistence happens separately: the client reviews the generated journal,
 * then calls POST /ai/save (-> saveJournal below) to actually store it.
 * This two-step flow is intentional — it lets the user see and discard a
 * generation without it silently becoming a permanent journal entry.
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

    let aiResponse;
    try {
      aiResponse = await aiProvider.invoke(prompt);
    } catch {
      throw new AppError(
        "The AI service is temporarily unavailable. Please try again shortly.",
        502,
      );
    }

    const parsedJson = JsonParser.parse(aiResponse.content.toString());
    const result = journalAIResponseSchema.safeParse(parsedJson);

    if (!result.success) {
      throw new AppError(
        "The AI returned an unexpected response. Please try again.",
        502,
      );
    }

    return result.data;
  }

  async saveJournal(userId: string, data: SaveJournalDTO) {
    const existing = await aiRepository.getTodayJournal(userId);

    if (existing) {
      throw new AppError(
        "You've already saved a journal entry for today. Check your Journal history.",
        409,
      );
    }

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
