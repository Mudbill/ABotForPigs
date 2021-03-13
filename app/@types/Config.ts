import { GuildMember } from 'discord.js';
import Activity from './Activity';
import Response from './Response';

export default interface Config {
	token: string,
	prefix: string,
	databaseFile: string,
	activities: [Activity, string][],
	channels: {
		log: string,
		welcome: string
	},
	welcomeMessages: (member: GuildMember) => string[],
	responses: Response[]
}