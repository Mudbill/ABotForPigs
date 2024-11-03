import { getPhrases, Phrase } from "../db/database";
import { Service } from "../types";
import { logger } from "../utils/log";

let phrases: Phrase[] = [];

const PhraseService: Service = async (client) => {
  client.on("messageCreate", async (msg) => {
    try {
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
    } catch (error) {
      logger.error("Command failed", error);
      msg.channel.send(
        "Internal error occurred, can someone fucking fix this shit??"
      );
    }
  });

  await loadPhrases();

  logger.info("PhraseService initialized");
};

export async function loadPhrases() {
  phrases = await getPhrases();
  logger.info(`Loaded ${phrases.length} phrases`);
}

export default PhraseService;
