import { AppError } from "../../../utils/AppError.js";

export class JsonParser {
  static parse(content: string): unknown {
    if (!content || typeof content !== "string") {
      throw new AppError("The AI returned an empty response. Please try again.", 502);
    }

    // 1. Remove markdown fences if present
    let cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Try parsing directly
    try {
      return JSON.parse(cleaned);
    } catch {
      // 3. Fallback: Extract outermost JSON object from { to }
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const extracted = cleaned.substring(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(extracted);
        } catch {
          // Continue to error throw below
        }
      }

      throw new AppError(
        "The AI returned a response we couldn't understand. Please try again.",
        502,
      );
    }
  }
}
