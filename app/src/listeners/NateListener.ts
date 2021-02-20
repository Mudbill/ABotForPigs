import { Client } from "discord.js";
import { console } from '../util/log';
// import crypto from 'crypto';
// import https from 'https';
// import child_process from 'child_process';
// import fs from 'fs';
import db from '../util/db';

export default async function (client: Client) {
	client.on('message', async (msg) => {
		const nate = '203652305772478465';
		if (msg.member.user.id !== nate) return;

		const emojis = await db.findOne({ _id: 'nate_emojis' });
		if (emojis) {
			const list: string[] = emojis.value;
			const msgEmojis = msg.content.matchAll(/(?<!\\)<:\w*:([0-9]{18})>/g);

			for (const emoji of msgEmojis) {
				const [, emojiID] = emoji;

				if (list.includes(emojiID)) {
					const status = await db.findOne({ _id: 'nate_enable' });
					if (status && status.value === true) {
						msg.channel.send(`<@${nate}> <:cmon:811019110531596308>`);
					}
					return;
				}
			}
		}

		if (msg.content.match(/:\w*cmon\w*:/)) {
			const status = await db.findOne({ _id: 'nate_enable' });
			if (status && status.value === true) {
				msg.channel.send(`<@${nate}> <:cmon:811019110531596308>`);
			}
			return;
		}

		// const child = child_process.spawn(`curl www.google.com`);
		// child.stdout.on('data', a => {
		// 	console.log(a)
		// })

		// const emojis = msg.content.matchAll(/<:\w*:([0-9]*)>/g);
		// for (const match of emojis) {
		// 	const eID = match[1];
		// 	const url = `https://cdn.discordapp.com/emojis/${eID}.png?v=1`;

		// 	console.log(url);
		// 	https.request(url, (r) => {
		// 		console.log(r);
		// 	});

		// 	// http.request({
		// 	// 	host: 'cdn.discordapp.com',
		// 	// 	port: 443,
		// 	// 	method: 'GET',
		// 	// 	path: `/emojis/${eID}.png?v=1`
		// 	// }, (res) => {
		// 	// 	console.log(res);
		// 	// });

		// 	// const hash = crypto.createHash('sha1');
		// 	// hash.setEncoding('hex');
		// }
	});

	console.info('Initialized Nate listener');
}
