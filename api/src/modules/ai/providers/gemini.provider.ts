import { ChatGoogle } from "@langchain/google";
import { GEMINI_API_KEY } from "../../../config/env.config.js";

/**
 * Gemini provider — wraps @langchain/google's ChatGoogle.
 */
class GeminiProvider {
  private model: ChatGoogle;

  constructor() {
    this.model = new ChatGoogle({
      apiKey: GEMINI_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.3,
      maxRetries: 2,
    });
  }

  public getModel(): ChatGoogle {
    return this.model;
  }
}

export default new GeminiProvider();
