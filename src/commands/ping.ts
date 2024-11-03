import { PermissionsBitField } from "discord.js";
import { Command } from "../types";
import { loadingEmoji } from "../utils/emojis";

const PingCommand: Command = {
  alias: "ping",
  permission: PermissionsBitField.Flags.SendMessages,
  exec: async (msg, args) => {
    if (!msg.channel.isSendable()) {
      return;
    }
    const msg2 = await msg.channel.send(loadingEmoji);
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
