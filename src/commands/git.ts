import { PermissionsBitField } from "discord.js";
import git from "simple-git";

const GitCommand: Command = {
  alias: "git",
  permission: PermissionsBitField.Flags.Administrator,
  exec: async (msg, args) => {
    if (args._[0] === "pull") {
      let result = await git(__dirname).raw([
        "pull",
        "--stat",
        "origin",
        "master",
      ]);
      let output = result.slice(0, 500);

      msg.channel.send({
        embeds: [
          {
            title: "git pull",
            description: "```" + output + "```",
            timestamp: new Date().toISOString(),
            author: {
              name:
                msg.member?.nickname ||
                msg.member?.user.username ||
                msg.author.username,
              icon_url: msg.member?.user.avatarURL() || undefined,
            },
          },
        ],
      });
    }
  },
};

export default GitCommand;
