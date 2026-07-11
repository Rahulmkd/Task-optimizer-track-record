import { ChatGroq } from "@langchain/groq";
import { GROQ_API_KEY } from "../../../config/env.config.js";

/**
 * Groq provider — wraps @langchain/groq's ChatGroq.
 *
 */
class GroqProvider {
  private model: ChatGroq;

  constructor() {
    this.model = new ChatGroq({
      apiKey: GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      maxRetries: 2,
    });
  }

  public getModel(): ChatGroq {
    return this.model;
  }
}

export default new GroqProvider();
