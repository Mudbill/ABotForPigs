import { Message, PartialMessage } from "discord.js";
import { Service } from "../types";

export const GoodMorningService: Service = async (client) => {
  async function handler(message: Message<boolean> | PartialMessage) {
    const channel = message.guild?.channels.cache.find((c) =>
      c.name.toLowerCase().includes("good-morning")
    );
    if (channel?.id !== message.channelId) {
      return;
    }

    const goodIndex = message.content?.toLowerCase().indexOf("good") ?? -1;
    const morningIndex =
      message.content?.toLowerCase().indexOf("morning") ?? -1;

    if (goodIndex !== -1 && morningIndex !== -1 && goodIndex < morningIndex) {
      // yay
    } else {
      message.delete();
    }
  }

  client.on("messageCreate", handler);
  client.on("messageUpdate", (oldMessage, newMessage) => {
    handler(newMessage);
  });
};
