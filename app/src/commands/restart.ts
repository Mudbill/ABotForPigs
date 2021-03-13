import { Permissions } from "discord.js";
import Command from "../../@types/Command";

const command: Command = {
	command: 'restart',
	permission: Permissions.FLAGS.ADMINISTRATOR,
	exec: async (args, msg) => {
		msg.channel.send('Gonna kill myself, I hope someone will catch my fall...');
		setTimeout(() => {
			process.exit();
		}, 1000);
	}
}

export default command;