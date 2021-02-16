import { Client } from "discord.js";
import { console } from '../util/log';

export default async function (client: Client) {
	client.on('message', (msg) => {
		const nate = '203652305772478465';
		if (msg.member.user.id !== nate) return;

		if (msg.content.match(/:\w*cmon\w*:/)) {
			msg.reply(`<:cmon:811019110531596308>`);
		}
	});

	console.info('Initialized Nate listener');
}
