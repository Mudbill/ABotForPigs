import { Permissions } from "discord.js";
import Command from "../../@types/Command"

const command: Command = {
	command: 'about',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	exec: async (args, msg) => {
		msg.channel.send(`a strand-type bot made by an incompetent programmer so do you understand`);
	}
}

export default command;