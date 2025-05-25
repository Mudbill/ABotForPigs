import { GoogleGenAI } from "@google/genai";
import type { Service } from "../types";
import { logger } from "../utils/log";

export const GeminiService: Service = async (client) => {
  const token = process.env.GEMINI_TOKEN;
  if (!token) {
    throw new Error("Failed to get Gemini token");
  }
  const ai = new GoogleGenAI({ apiKey: token });

  client.on("messageCreate", async (message) => {
    const [, query] = message.content.split(`<@${client.user?.id}> `);
    if (!query) {
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
      });

      const text = response.candidates
        ?.find(() => true)
        ?.content?.parts?.find(() => true)?.text;

      if (text) {
        message.reply({ content: text });
      } else {
        throw new Error("Failed to get response");
      }
    } catch (e) {
      message.reply("Uh... sorry I had a brainfart");
      console.error(e);
    }
  });

  logger.info("GeminiService initialized");
};
