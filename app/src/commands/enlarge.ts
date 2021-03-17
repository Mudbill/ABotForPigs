import { Permissions } from "discord.js";
import Command from "../../@types/Command"

const command: Command = {
	command: 'e',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	exec: async (args, msg) => {
		if (!args.length) {
			msg.channel.send('enlarge what? your dick? <:cmon:820326876719218769>');
			return;
		}

		let match = args[0].match(/(?<!\\)<:\w*:([0-9]{18})>/);
		if (match) {
			msg.channel.send(`https://cdn.discordapp.com/emojis/${match[1]}.png`);
			return;
		} else {
			match = args[0].match(/(?<!\\)<a:\w*:([0-9]{18})>/);
			if (match) {
				msg.channel.send(`https://cdn.discordapp.com/emojis/${match[1]}.gif`);
				return;
			}
		}

		msg.channel.send(`give me an emoji next time`);
	}
}

export default command;