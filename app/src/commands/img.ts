import { Message, Permissions } from "discord.js";
import Command from "../../@types/Command"
import { image_search } from 'duckduckgo-images-api';

const users = {};

const command: Command = {
	command: 'img',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	exec: async (args, msg) => {
		console.log('users', users);

		if (!args.length) {
			msg.channel.send('<:cmon_tired:820326776562778133> Missing search query');
			return;
		}

		const query = args.join(' ');

		const reply = await msg.channel.send({
			content: `>${query}`,
			embed: {
				description: '<a:loading:820326540620857375> Fetching results...'
			}
		});

		const params = {
			query,
			moderate: true,
			iterations: 1,
			retries: 1
		}

		const result = await image_search(params);
		if (!result.length) {
			reply.edit({
				content: 'No results, try searching something less retarded next time',
				embed: null
			});
			return;
		}

		reply.edit({
			content: result[0].image,
			embed: null
		});

		// Set up ability to pick next and previous image in resultset

		let timeout: NodeJS.Timeout;
		let index = 0;

		async function followup(msg2: Message) {
			if (msg2.author.id !== msg.author.id) return;
			if (['n', 'next'].includes(msg2.content)) {
				if (timeout) timeout.refresh();

				await msg2.delete();

				++index;
				if (result.length <= index) {
					console.log('exceeded array. i=', index, ' l=', result.length);
					index = result.length - 1;
					return;
				};

				return await reply.edit({
					content: result[index].image
				});
			}
			if (['p', 'prev', 'previous', 'b', 'back'].includes(msg2.content)) {
				if (timeout) timeout.refresh();

				await msg2.delete();

				--index;
				if (index < 0) return index = 0;

				return reply.edit({
					content: result[index].image
				});
			}
		}

		function timeIsOut() {
			msg.client.off('message', followup);
			timeout = null;
			delete users[msg.author.id];
			console.log(`Cleared listener for ${msg.author.username}`);
		}

		if (users[msg.author.id]) {
			users[msg.author.id].destroy();
		}

		msg.client.on('message', followup);
		timeout = setTimeout(timeIsOut, 15000);

		users[msg.author.id] = {
			timeout,
			destroy: () => {
				timeIsOut();
				clearTimeout(timeout);
			}
		};
	}
}

export default command;