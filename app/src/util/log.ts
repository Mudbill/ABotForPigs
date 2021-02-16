import chalk from 'chalk';
import { Message } from 'discord.js';

const con = {
	log: (msg: any, ...obj: any) => {
		console.log(msg, ...obj)
	},
	info: (msg: any, ...obj: any) => {
		console.info(`${chalk.greenBright('[INFO]')}`, msg, ...obj);
	},
	error: (msg: any, ...obj: any) => {
		console.error(`${chalk.redBright('[ERROR]')}`, msg, chalk.red(...obj));
	},
	fatal: (msg: any, ...obj: any) => {
		console.error(`${chalk.redBright('[FATAL]')}`, msg, chalk.red(...obj));
	}
};

const channel = {
	info: (message: Message, text: any) => {
		message.channel.send(text);
	},
	warn: (message: Message, text: any, exception: Error) => {
		message.channel.send(text);
	},
	error: (message: Message, text: any, exception: Error) => {
		message.channel.send(text);
	}
}

export {
	con as console,
	channel
};