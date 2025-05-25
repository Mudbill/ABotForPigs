import { Service } from "../types";

export const EmojiService: Service = async (client) => {
  client.on("emojiDelete", (emoji) => {
    const channel = emoji.guild.channels.cache.find((c) =>
      c.name.includes("announcements")
    );
    if (channel?.isTextBased()) {
      channel.send(`Emoji ${emoji} has been nuked! ${emoji.url}`);
    }
  });

  client.on("emojiCreate", (emoji) => {
    const channel = emoji.guild.channels.cache.find((c) =>
      c.name.includes("announcements")
    );
    if (channel?.isTextBased()) {
      channel.send(`Introducing emoji ${emoji}`);
    }
  });
};
