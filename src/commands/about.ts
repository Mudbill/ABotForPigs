import { PermissionsBitField } from "discord.js";

const AboutCommand: Command = {
  alias: "about",
  permission: PermissionsBitField.Flags.SendMessages,
  exec: async (msg, args) => {
    msg.channel.isSendable() &&
      msg.channel.send(
        `a strand-type bot made by an incompetent programmer so do you understand`
      );
  },
};

export default AboutCommand;
