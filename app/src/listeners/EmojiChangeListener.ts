import { Client } from "discord.js";

export default async function (client: Client) {
  client.on("emojiDelete", (emoji) => {
    const channel = emoji.guild.channels.cache.find(
      (c) => c.name === "announcements"
    );
    if (channel.isText()) {
      channel.send(`Emoji ${emoji} has been nuked! ${emoji.url}`);
    }
  });

  client.on("emojiCreate", (emoji) => {
    const channel = emoji.guild.channels.cache.find(
      (c) => c.name === "announcements"
    );
    if (channel.isText()) {
      channel.send(`Introducing emoji ${emoji}`);
    }
  });
}
