import { Permissions } from "discord.js";
import Command from "../../@types/Command"
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

// Keep these in memory for speed
let browser: puppeteer.Browser;
let page: puppeteer.Page;

const command: Command = {
	command: 'yt',
	permission: Permissions.FLAGS.SEND_MESSAGES,
	init: async () => {
		browser = await puppeteer.launch({
			executablePath: '/usr/bin/chromium-browser'
		});
		page = await browser.newPage();
		await page.setViewport({ width: 750, height: 600 });
		await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:43.0) Gecko/20100101 Firefox/43.0');
	},
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

		// Set up search query and connect to Youtube
		const params = new URLSearchParams();
		params.set('search_query', query);
		await page.goto(`https://www.youtube.com/results?${params}`);

		reply.edit({
			content: `>${query}`,
			embed: {
				description: '<a:loading:820326540620857375> Looking for video...'
			}
		});

		// Parse the HTML output
		await page.waitForSelector('div.ytd-app', { timeout: 10000 });
		const html = await page.content();

		const $ = cheerio.load(html);
		const first = $('#contents ytd-video-renderer,#contents ytd-grid-video-renderer').first();

		const videoAnchor = first.find('#video-title');

		const data = {
			// title: videoAnchor.text().trim(),
			link: videoAnchor.attr('href')
		}

		if (data.link) {
			reply.edit({
				content: `https://www.youtube.com${data.link}`,
				embed: null
			});
		} else {
			reply.edit({
				content: `No videos found for "${query}"`,
				embed: null
			});
		}
	},
	exit: async () => {
		if (browser) {
			await browser.close();
		}
	}
}

export default command;
