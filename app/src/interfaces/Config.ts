import { GuildMember } from 'discord.js';
import Activity from '../enums/Activity';
import Response from '../interfaces/Response';

export default interface Config {
	token: string,
	prefix: string,
	activities: [Activity, string][],
	channels: {
		log: string,
		welcome: string
	},
	welcomeMessages: (member: GuildMember) => string[],
	responses: Response[]
}