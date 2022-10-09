import { getPhrases } from "../database";
import { console } from "../util/log";

let phrases: Phrase[] = [];

const PhraseListener: Listener = async (client) => {
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    for (const phrase of phrases) {
      if (msg.guildId !== phrase.serverId) continue;

      const regex = new RegExp(phrase.trigger);

      if (!regex.test(msg.content.toLowerCase())) {
        continue;
      }

      if (phrase.channels?.length) {
        if (
          phrase.channels.includes(`<#${msg.channelId}>`) ===
          Boolean(phrase.blacklist)
        )
          continue;
      }

      const rand = Math.random();
      if (rand > phrase.chance) {
        continue;
      }

      const msg2 = await msg.channel.send(phrase.reply);

      if (phrase.flash) {
        await msg2.delete();
      }
    }
  });

  await loadPhrases();

  console.info("PhraseListener initialized");
};

export async function loadPhrases() {
  phrases = await getPhrases();
  console.info(`Loaded ${phrases.length} phrases`);
}

export default PhraseListener;
