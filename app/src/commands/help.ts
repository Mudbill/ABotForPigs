import { Permissions } from "discord.js";
import Command from "../../@types/Command"
// import { commands } from '../listeners/CommandListener';

const command: Command = {
	command: 'help',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	exec: async (args, msg) => {
		msg.channel.send(`try \`--yt <query>\` or \`--img <query>\` or \`--e <emoji>\``);
	}
}

export default command;