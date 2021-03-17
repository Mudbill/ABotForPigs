import { Message, Permissions } from "discord.js";
import Command from "../../@types/Command"
import youtube from 'scrape-youtube';

const users = {};

const command: Command = {
	command: 'yt',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	exec: async (args, msg) => {
		if (!args.length) {
			msg.channel.send('<:cmon_tired:820326776562778133> Missing search query');
			return;
		}

		const query = args.join(' ');

		const reply = await msg.channel.send({
			content: `>${query}`,
			embed: {
				description: '<a:loading:820326540620857375> Connecting to Youtube...'
			}
		});

		const { videos } = await youtube.search(query);
		if (!videos.length) {
			reply.edit({
				content: 'No results, try searching something less retarded next time',
				embed: null
			});
			return;
		}

		reply.edit({
			content: videos[0].link,
			embed: null
		});

		// Set up ability to pick next and previous image in resultset

		let timeout: NodeJS.Timeout;
		let index = 0;

		async function followup(msg2: Message) {
			if (msg2.author.id !== msg.author.id) return;
			if (['n', 'next'].includes(msg2.content.toLowerCase())) {
				if (timeout) timeout.refresh();

				await msg2.delete();

				++index;
				if (videos.length <= index) {
					console.log('exceeded array. i=', index, ' l=', videos.length);
					index = videos.length - 1;
					return;
				};

				return await reply.edit({
					content: videos[index].link
				});
			}
			if (['p', 'prev', 'previous', 'b', 'back'].includes(msg2.content.toLowerCase())) {
				if (timeout) timeout.refresh();

				await msg2.delete();

				--index;
				if (index < 0) return index = 0;

				return reply.edit({
					content: videos[index].link
				});
			}
		}

		function timeIsOut() {
			msg.client.off('message', followup);
			timeout = null;
			delete users[msg.author.id];
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
