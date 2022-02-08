import { Client } from "discord.js";
import { console } from "../util/log";

export default async function (client: Client) {
  client.on("message", async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.toLowerCase().includes("spelos")) {
      if (Math.random() < 0.5) {
        const msg2 = await msg.channel.send("beg for it :)");
        msg2.delete();
      } else {
        const msg2 = await msg.channel.send("🤗");
        msg2.delete();
      }
    }
  });

  console.info("Initialized Spelos listener");
}
