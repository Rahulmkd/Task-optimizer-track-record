import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AI_PROVIDER } from "../../../config/env.config.js";

/**
 * Selects the active LangChain chat model based on AI_PROVIDER.
 */

const loadProvider = async (): Promise<BaseChatModel> => {
  if (AI_PROVIDER === "groq") {
    const { default: groqProvider } = await import("./groq.provider.js");
    return groqProvider.getModel();
  }

  const { default: geminiProvider } = await import("./gemini.provider.js");
  return geminiProvider.getModel();
};

let cachedProvider: Promise<BaseChatModel> | null = null;

const getProvider = (): Promise<BaseChatModel> => {
  if (!cachedProvider) {
    cachedProvider = loadProvider();
  }

  return cachedProvider;
};

const aiProvider = {
  async invoke(prompt: string) {
    const model = await getProvider();
    return model.invoke(prompt);
  },
};

export default aiProvider;
