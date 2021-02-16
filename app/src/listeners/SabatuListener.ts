import { Client } from "discord.js";
import { console } from '../util/log';

export default async function (client: Client) {
	client.on('message', async (msg) => {
		if (msg.content.toLowerCase().includes('sabatu')) {
			const msg2 = await msg.channel.send('🙂');
			msg2.delete();
		}
	});

	console.info('Initialized Sabatu listener');
}
