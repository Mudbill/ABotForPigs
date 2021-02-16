import { Permissions } from "discord.js";
import Command from "../interfaces/Command"
// import { commands } from '../listeners/CommandListener';

const command: Command = {
	command: 'help',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	exec: async (args, msg) => {
		msg.channel.send('maybe later');
	}
}

export default command;