const EmojiChangeListener: Listener = async (client) => {
  client.on("emojiDelete", (emoji) => {
    const channel = emoji.guild.channels.cache.find(
      (c) => c.name === "announcements"
    );
    if (channel?.isTextBased()) {
      channel.send(`Emoji ${emoji} has been nuked! ${emoji.url}`);
    }
  });

  client.on("emojiCreate", (emoji) => {
    const channel = emoji.guild.channels.cache.find(
      (c) => c.name === "announcements"
    );
    if (channel?.isTextBased()) {
      channel.send(`Introducing emoji ${emoji}`);
    }
  });
};

export default EmojiChangeListener;
