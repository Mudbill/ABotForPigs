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

    await message.channel.sendTyping();

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        contents: `Pretend to be a quirky and edgy person who spends too much time on the internet. Make sure all responses are below 1900 characters. Now respond to the following: ${query}`,
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
