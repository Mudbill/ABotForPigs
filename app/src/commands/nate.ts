import { Permissions } from "discord.js";
import Command from "../interfaces/Command"
import db from '../util/db';

const command: Command = {
	command: 'nate',
	permission: Permissions.FLAGS.ADMINISTRATOR,
	exec: async (args, msg) => {
		if (args.length > 0) {
			const [arg1, arg2] = args;
			let emojiID: string;

			if (!['add', 'remove', 'list', 'toggle'].includes(arg1)) {
				msg.channel.send(`arg1 must be add, remove, list or toggle`);
				return;
			}

			// If arg2 is given, extract emoji ID from it
			if (arg2) {
				if (arg2.startsWith(`https://`)) {
					const match = arg2.match(/\/([0-9]{18}).png/);
					if (match) {
						emojiID = match[1];
					}
				}
				else if (/[0-9]{18}/.test(arg2)) {
					emojiID = arg2;
				}
			}

			// if ADD command, register emoji ID in database
			if (arg1 === 'add') {

				if (!emojiID) {
					msg.channel.send(`arg 2 must be an 18-digit emoji ID or the URL to the emoji (right click -> copy link)`);
					return;
				}

				const emojis = await db.findOne({ _id: 'nate_emojis' });
				if (emojis) {
					const list: string[] = emojis.value;

					if (list.includes(emojiID)) {
						msg.channel.send(`Already added.`);
						return;
					}
				}

				const result = await db.update(
					{ _id: 'nate_emojis' },
					{ $push: { value: emojiID } },
					{ upsert: true }
				);

				if (result) {
					msg.channel.send(`Added ${emojiID} to database.`);
				} else {
					msg.channel.send(`I think something went wrong...`);
				}
			}

			// if REMOVE command, remove emoji from database
			else if (arg1 === 'remove') {
				if (!emojiID) {
					msg.channel.send(`arg 2 must be an 18-digit emoji ID or the URL to the emoji (right click -> copy link)`);
					return;
				}

				const emojis = await db.findOne({ _id: 'nate_emojis' });
				if (emojis) {
					const list: string[] = emojis.value;

					if (!list.includes(emojiID)) {
						msg.channel.send(`Emoji not found in database.`);
						return;
					}

					const result = await db.update(
						{ _id: 'nate_emojis' },
						{ value: list.filter(eID => eID !== emojiID) }
					);

					if (result) {
						msg.channel.send(`Removed ${emojiID} from database.`);
					} else {
						msg.channel.send(`I think something went wrong...`);
					}
				} else {
					msg.channel.send(`Emoji not found in database.`);
					return;
				}
			}

			// if LIST command, display registered emojis
			else if (arg1 === 'list') {
				const emojis = await db.findOne({ _id: 'nate_emojis' });
				let list: string[];
				if (emojis) {
					list = emojis.value;
				}
				msg.channel.send(['Emoji IDs added:', ...list]);
				return;
			}

			// if TOGGLE command, turn the reply on or off
			else if (arg1 === 'toggle') {
				let enable = false;
				const status = await db.findOne({ _id: 'nate_enable' });
				if (status) {
					enable = status.value;
				}

				await db.update(
					{ _id: 'nate_enable' },
					{ _id: 'nate_enable', value: !enable },
					{ upsert: true }
				);

				msg.channel.send(`Run Nate listener: ${!enable}`);
			}

			return;
		}

		const nateID = '203652305772478465';
		const nate = msg.guild.members.cache.get(nateID);
		if (!nate) return;

		const { lastMessage } = nate;
		if (lastMessage) {
			lastMessage.channel.send(`<@${nateID}> <:cmon:811019110531596308>`);
		}
	}
}

export default command;
