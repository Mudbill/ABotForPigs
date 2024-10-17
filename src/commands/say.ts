import { Message, PermissionsBitField } from "discord.js";
import { Command } from "../types";

const SayCommand: Command = {
  alias: "say",
  permission: PermissionsBitField.Flags.Administrator,
  exec: async (msg, args) => {
    const arg1 = `${args._[0]}`;
    const channel = getChannel(msg, arg1);
    if (!channel) {
      return msg.reply("Can't find that channel");
    }
    if (!channel.isTextBased()) {
      return msg.reply("That channel is gay, I won't do it.");
    }
    const content = args._.slice(1).join(" ");
    if (!content.length) {
      return msg.reply("moron says what?");
    }
    channel.send(content);
  },
};

const getChannel = (msg: Message, str: string) => {
  if (str.startsWith("<#") && str.endsWith(">")) {
    const channelId = str.slice(2, -1);
    const channel = msg.guild?.channels.cache.get(channelId);
    return channel;
  }
};

export default SayCommand;
