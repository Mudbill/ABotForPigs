import { Permissions } from "discord.js";
import Command from "../interfaces/Command"

const command: Command = {
	command: 'nate',
	permission: Permissions.FLAGS.ADMINISTRATOR,
	exec: async (args, msg) => {
		const nateID = '105692860271042560';
		const nate = msg.guild.members.cache.get(nateID);
		if (!nate) return;

		const { lastMessage } = nate;
		if (lastMessage) {
			lastMessage.channel.send(`<@${nateID}> <:cmon:811019110531596308>`);
		}
	}
}

export default command;