import { Client } from 'discord.js'
import Activity from '../../@types/Activity';
import { prefix, activities } from '../../config'
import { console } from '../util/log'

const { WATCHING } = Activity;

export default async function (client: Client) {
	// Set initial activity
	const mainActivity = `for ${prefix}help`
	await setActivity(client, WATCHING, mainActivity);

	const intervalTime = 1000 * 60 * 5 // 5 minutes in ms
	const timeoutTime = 1000 * 60 // 1 minute in ms

	// Update activity to a random entry every 5 minutes
	setInterval(async () => {
		const rand = Math.floor(Math.random() * activities.length)
		const [type, msg] = activities[rand]

		await setActivity(client, type, msg);

		// After 1 minute, reset back to initial activity
		setTimeout(async () => {
			await setActivity(client, WATCHING, mainActivity)
		}, timeoutTime)
	}, intervalTime)

	console.info('Initialized activity changer')
}

async function setActivity(client: Client, type: Activity, msg: string) {
	try {
		await client.user.setActivity(msg, { type })
	} catch (err) {
		console.error(`Failed to set activity`, err)
	}
}