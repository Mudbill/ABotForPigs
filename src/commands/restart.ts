import { PermissionsBitField } from "discord.js";
import { Command } from "../types";

const RestartCommand: Command = {
  alias: "restart",
  permission: PermissionsBitField.Flags.Administrator,
  exec: async (msg, args) => {
    if (!msg.channel.isSendable()) {
      return;
    }
    msg.channel.send("Gonna kill myself, I hope someone will catch my fall...");
    setTimeout(() => {
      process.exit();
    }, 1000);
  },
};

export default RestartCommand;
