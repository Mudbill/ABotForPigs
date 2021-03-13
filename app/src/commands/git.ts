import Command from "../../@types/Command"
import git from 'simple-git';
import { Permissions } from "discord.js";

const command: Command = {
	command: 'git',
	permission: Permissions.FLAGS.ADMINISTRATOR,
	exec: async (args, msg) => {
		if (args.length === 1 && args[0] === 'pull') {
			let result = await git(__dirname).raw(['pull', '--stat', 'origin', 'master']);
			let output = result.slice(0, 500);

			const embed = {
				title: 'git pull',
				description: `\`\`\`${output}\`\`\``,
				timestamp: new Date(),
				author: {
					name: msg.member.nickname || msg.member.user.username,
					iconURL: msg.member.user.avatarURL()
				}
			};

			msg.channel.send({ embed });
		}
	}
}

export default command;