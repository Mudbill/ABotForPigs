import Activity from '../src/enums/Activity';
import Config from '../src/interfaces/Config';
import _token from './token.config';

const { PLAYING, LISTENING_TO, WATCHING } = Activity;

const config: Config = {
	token: _token,
	prefix: '--',
	databaseFile: 'database.json',
	activities: [
		[PLAYING, 'you for a fool'],
		[LISTENING_TO, 'my mixtape'],
		[WATCHING, 'you masturbate ;)']
	],
	channels: {
		log: 'bot_log',
		welcome: 'welcome'
	},
	welcomeMessages: (member) => [
		`Welcome to the server ${member}`,
		`${member} has joined the server!`
	],
	responses: []
}

export const {
	token,
	prefix,
	databaseFile,
	activities,
	channels,
	welcomeMessages,
	responses
} = config;

export default config;