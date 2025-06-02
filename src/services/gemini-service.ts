import { GoogleGenAI, type Content } from "@google/genai";
import type { Service } from "../types";
import { logger } from "../utils/log";

export const dynamicPersonality = {
  current: `\
Pretend to be a flamboyant furry gamer who spends too much time on the internet. 
`,
};

const staticPersonality = `\
If you say something sassy, inject <:cmon:1302649862776688700> into the message (it is an eye-rolling emoji)
Don't be afraid to say something outrageous. 
Use some abbreviations. 
Use swear words occasionally. 
Prefer shorter responses up to 300 characters, unless asked to elaborate. 
Make sure all responses are below 1900 characters.
Now respond to the following:
`;

type ChatContext = {
  lastUpdated: number;
  history: Content[];
};

export const chatCache = new Map<string, ChatContext>();

export const GeminiService: Service = async (client) => {
  const token = process.env.GEMINI_TOKEN;
  if (!token) {
    throw new Error("Failed to get Gemini token");
  }
  const ai = new GoogleGenAI({ apiKey: token });

  client.on("messageCreate", async (msg) => {
    const [, query] = msg.content.split(`<@${client.user?.id}> `);
    if (!query) {
      return;
    }

    const userId = msg.author.id;
    let history = chatCache.get(userId)?.history ?? [];

    await msg.channel.sendTyping();

    try {
      const chat = ai.chats.create({
        model: "gemini-2.5-flash-preview-05-20",
        history,
      });

      const prompt = `${dynamicPersonality.current} ${staticPersonality} ${query}`;

      const response = await chat.sendMessage({
        message: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error("Failed to get response");
      }

      // If history is empty, first register the personality, otherwise just continue the conversation
      if (history.length === 0) {
        history.push({
          role: "user",
          parts: [
            {
              text: staticPersonality,
            },
            {
              text: query,
            },
          ],
        });
      } else {
        history.push({
          role: "user",
          parts: [
            {
              text: query,
            },
          ],
        });
      }

      // Then register the AI response
      history.push({
        role: "model",
        parts: [
          {
            text,
          },
        ],
      });

      // Store the cache for later
      chatCache.set(userId, { history, lastUpdated: Date.now() });

      const messages: string[] = [];

      // If response message is too long for Discord messages, split them up into chunks
      if (text.length >= 2000) {
        const parts = text.split(". ");
        let messageBuilder = "";
        for (const part of parts) {
          const combinedLength = messageBuilder.length + part.length;
          if (combinedLength < 2000) {
            messageBuilder += part + ". ";
          } else {
            messages.push(messageBuilder);
            messageBuilder = "";
          }
        }
      } else {
        messages.push(text);
      }

      // Send all message chunks, first one being a pinged reply
      let hasReplied = false;
      for (const message of messages) {
        if (!hasReplied) {
          await msg.reply(message);
          hasReplied = true;
        } else {
          await msg.channel.sendTyping();
          await sleep(2000);
          await msg.channel.send(message);
        }
      }
    } catch (e) {
      msg.reply("Uh... sorry I had a brainfart");
      console.error(e);
    }
  });

  // Register a routine cleanup of the cache if it has been more than 5 minutes since last message
  setInterval(() => {
    const now = Date.now();
    for (const [userId, context] of chatCache) {
      const msAgo = now - context.lastUpdated;
      if (msAgo > 1000 * 60 * 5) {
        console.log("Deleting chat history for user", userId);
        chatCache.delete(userId);
      }
    }
  }, 1000 * 60);

  logger.info("GeminiService initialized");
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
