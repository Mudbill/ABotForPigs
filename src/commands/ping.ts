import { PermissionsBitField } from "discord.js";

const PingCommand: Command = {
  alias: "ping",
  permission: PermissionsBitField.Flags.SendMessages,
  exec: async (msg, args) => {
    const msg2 = await msg.channel.send("🙂");
    const delay = msg2.createdTimestamp - msg.createdTimestamp;

    msg2.edit({
      content: "",
      embeds: [
        {
          fields: [
            { name: "API:", value: `${msg.client.ws.ping}ms`, inline: true },
            { name: "Bot:", value: `${delay}ms`, inline: true },
          ],
        },
      ],
    });
  },
};

export default PingCommand;
