import { AI_PROVIDER } from "../../../config/env.config.js";
import geminiProvider from "./gemini.provider.js";
import groqProvider from "./groq.provider.js";

/**
 * Selects the active LangChain chat model at startup based on the AI_PROVIDER
 */
const aiProvider =
  AI_PROVIDER === "groq" ? groqProvider.getModel() : geminiProvider.getModel();

export default aiProvider;
