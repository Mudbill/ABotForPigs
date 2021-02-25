import { Client } from "discord.js";
import { console } from '../util/log';

export default async function (client: Client) {
	client.on('message', async (msg) => {
		const txt = msg.content.toLowerCase();
		if (txt.includes('play') && txt.includes('half') && txt.includes('life')) {
			msg.channel.send(`<:cmon:811019110531596308>`);
		}
	});

	console.info('Initialized Sabatu listener');
}
