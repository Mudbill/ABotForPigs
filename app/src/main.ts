import Discord from 'discord.js'
import { token } from '../config'
import { console } from './util/log'
import glob from 'glob'
import path from 'path'

async function main() {
	// Initialize the client
	const client = new Discord.Client()

	client.on('ready', () => {
		console.info(`Logged in as ${client.user.tag}`)
	})

	// Log in to an account
	try {
		await client.login(token)
	} catch (err) {
		return console.fatal('Failed to log in!')
	}

	// Initialize the listeners that await actions
	const files = glob.sync('./app/src/listeners/*')
	for (const file of files) {
		try {
			const { default: listener } = await import(path.resolve(file))
			await listener(client)
		} catch (err) {
			console.error(`Failed to load listener module: ${file}`, err)
		}
	}
}

main()
	.then(() => console.info('Bot initialized'))
	.catch((err) => console.error('Unhandled exception!', err))
