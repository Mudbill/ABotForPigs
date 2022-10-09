import { PermissionsBitField } from "discord.js";

const RestartCommand: Command = {
  alias: "restart",
  permission: PermissionsBitField.Flags.Administrator,
  exec: async (msg, args) => {
    msg.channel.send("Gonna kill myself, I hope someone will catch my fall...");
    setTimeout(() => {
      process.exit();
    }, 1000);
  },
};

export default RestartCommand;
