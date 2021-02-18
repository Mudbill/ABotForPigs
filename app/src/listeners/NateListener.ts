import { Client } from "discord.js";
import { console } from '../util/log';
import crypto from 'crypto';
import https from 'https';
import child_process from 'child_process';
import fs from 'fs';

export default async function (client: Client) {
	client.on('message', (msg) => {
		const nate = '203652305772478465';
		if (msg.member.user.id !== nate) return;

		if (msg.content.match(/:\w*cmon\w*:/)) {
			msg.channel.send(`<@${nate}> <:cmon:811019110531596308>`);
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
