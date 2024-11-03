import { Service } from "../types";

export const GoodMorningService: Service = async (client) => {
  client.on("messageCreate", async (message) => {
    const channel = message.guild?.channels.cache.find((c) =>
      c.name.toLowerCase().includes("good-morning")
    );
    if (channel?.id !== message.channelId) {
      return;
    }

    const goodIndex = message.content.toLowerCase().indexOf("good");
    const morningIndex = message.content.toLowerCase().indexOf("morning");

    if (goodIndex !== -1 && morningIndex !== -1 && goodIndex < morningIndex) {
      // yay
    } else {
      message.delete();
    }
  });
};
