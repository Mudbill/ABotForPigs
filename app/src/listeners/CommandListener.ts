import { Client, Permissions } from 'discord.js';
import glob from 'glob';
import path from 'path';
import { prefix } from '../../config';
import Command from '../../@types/Command';
import { console, channel } from '../util/log';

const map: Map<string, Command> = new Map();
export { map as commands };

export default async function (client: Client) {
	const files = glob.sync('./app/src/commands/*');
	// Just in case this function were to be called twice, we don't want it to duplicate the contents
	map.clear();

	const post = client.api.applications(client.user.id).guilds('685923643804352536').commands.post;

	for (const file of files) {
		try {
			const { default: cmd }: { default: Command } = await import(path.resolve(file));
			if (map.has(cmd.command)) {
				console.error(`Duplicate command ${cmd.command}`);
				continue;
			}
			cmd.init && cmd.init();
			map.set(cmd.command, cmd);

			post({
				data: {
					name: cmd.command,
					description: cmd.description || 'Missing description'
				}
			});
		} catch (err) {
			console.error('Failed to import command', err);
		}
	}

	client.ws.on('INTERACTION_CREATE', async interaction => {
		console.log(interaction);
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: 'Pong'
				}
			}
		})
	});

	// client.on('message', async msg => {
	// 	if (msg.channel.type === 'dm') return;
	// 	if (msg.author.bot) return;
	// 	if (!msg.content.startsWith(prefix)) return;

	// 	const args = msg.content.substr(prefix.length).split(' ');
	// 	const cmdstr = args.shift();
	// 	const command = map.get(cmdstr);

	// 	if (command) {
	// 		if (!msg.member.hasPermission(command.permission)) {
	// 			return channel.info(msg, `you're not my mom`);
	// 		}

	// 		try {
	// 			command.exec(args, msg)
	// 		} catch (err) {
	// 			return console.error('Failed executing command')
	// 		}
	// 	}
	// })
	console.info('Initialized command listener')
}