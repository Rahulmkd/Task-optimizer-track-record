import { AppError } from "../../../utils/AppError.js";

export class JsonParser {
  static parse(content: string): unknown {
    const cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new AppError(
        "The AI returned a response we couldn't understand. Please try again.",
        502,
      );
    }
  }
}
