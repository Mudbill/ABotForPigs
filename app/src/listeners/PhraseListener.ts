import { Client } from "discord.js";
import { console } from '../util/log';
import { responses } from '../../config'
import { randomIndex } from "../util";

export default async function (client: Client) {
	client.on('message', (msg) => {
		const { content } = msg;
		const response = responses.find(r => r.on.find(on => content.split(/\s/).includes(on)));

		if (response) {
			const index = randomIndex(response.say.length);
			const say = response.say[index];
			msg.channel.send(say);
		}
	});

	console.info('Initialized phrase listener');
}
