import { Client, Message } from "discord.js";
import { console } from '../util/log';
import db from '../util/db';

const mud = '105692860271042560';
const nate = '203652305772478465';


export default async function (client: Client) {
	client.on('message', async (msg) => {
		if (msg.member.user.id !== nate) return;

		const emojis = await db.findOne({ _id: 'nate_emojis' });
		if (emojis) {
			const list: string[] = emojis.value;
			const msgEmojis = msg.content.matchAll(/(?<!\\)<:\w*:([0-9]{18})>/g);

			for (const emoji of msgEmojis) {
				const emojiID = emoji[1];

				if (list.includes(emojiID)) {
					const status = await db.findOne({ _id: 'nate_enable' });
					if (status && status.value === true) {
						cmonDetected(msg);
					}
					return;
				}
			}
		}

		if (msg.content.match(/:\w*cmon\w*:/)) {
			const status = await db.findOne({ _id: 'nate_enable' });
			if (status && status.value === true) {
				cmonDetected(msg);
			}
			return;
		}
	});

	console.info('Initialized Nate listener');
}

let lastTime: Date;

async function cmonDetected(msg: Message) {
	const time = new Date();

	if (lastTime) {
		// If this cmon was within 60 seconds of the last one
		if ((time.getTime() - 60000) < lastTime.getTime()) {
			msg.channel.send(`<@${nate}> <:cmon:811019110531596308>`);
			// console.log(`replied a cmon. time = ${time}, lastTime = ${lastTime}`)
		}
	}

	// store time in memory
	lastTime = time;
}