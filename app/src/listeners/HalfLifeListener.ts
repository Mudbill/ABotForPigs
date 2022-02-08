import { Client } from "discord.js";
import { console } from "../util/log";

export default async function (client: Client) {
  client.on("message", async (msg) => {
    if (msg.author.bot) return;

    if (includesHalfLife(msg.content)) {
      msg.channel.send(`<:cmon:811019110531596308>`);
    }
    // const txt = msg.content.toLowerCase();
    // if (txt.includes('play')
    // 	&& ((txt.includes('half') && txt.includes('life'))
    // 		|| txt.includes('hl'))) {
    // 	msg.channel.send(`<:cmon:811019110531596308>`);
    // }
  });

  console.info("Initialized Half Life listener");
}

function includesHalfLife(str: string) {
  return /((play|piay).*(hl|(half|haif).?(life|iife)))/i.test(str);
}
