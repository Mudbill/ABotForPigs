import { Permissions } from 'discord.js';
import Command from '../../@types/Command'

const command: Command = {
	command: 'ping',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	exec: async (args, msg) => {
		const msg2 = await msg.channel.send('🙂');
		const delay = msg2.createdTimestamp - msg.createdTimestamp;

		msg2.edit({
			content: '',
			embed: {
				fields: [
					{ name: 'API:', value: `${msg.client.ws.ping}ms`, inline: true },
					{ name: 'Bot:', value: `${delay}ms`, inline: true },
				]
			}
		});
	}
}

export default command;