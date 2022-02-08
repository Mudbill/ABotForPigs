import { Client } from "discord.js";
import Phrase from "../../@types/Phrase";
import { getPhrases } from "../util/db";
import { console } from "../util/log";

let phrases: Phrase[] = [];

export default async function (client: Client) {
  client.on("message", (msg) => {
    if (msg.author.bot) return;

    for (const phrase of phrases) {
      if (!msg.content.toLowerCase().includes(phrase.trigger.toLowerCase())) {
        continue;
      }

      const rand = Math.random();
      if (rand > phrase.chance) {
        continue;
      }

      msg.channel.send(phrase.reply);
    }
  });

  await loadPhrases();

  console.info("Initialized phrase listener");
}

export async function loadPhrases() {
  const current = await getPhrases();
  phrases = [];
  for (const phrase of current) {
    phrases.push({
      chance: phrase.chance,
      trigger: phrase.trigger,
      reply: phrase.reply,
    });
  }
}
