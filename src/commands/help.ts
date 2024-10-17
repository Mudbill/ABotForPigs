import { PermissionsBitField } from "discord.js";
import { Command } from "../types";

const HelpCommand: Command = {
  alias: "help",
  permission: PermissionsBitField.Flags.SendMessages,
  exec: async (msg, args) => {
    msg.channel.isSendable() &&
      msg.channel.send(`i was too lazy to write a help page lol`);
  },
};

export default HelpCommand;
