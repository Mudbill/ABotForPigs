import { getReactions, Reaction } from "../db/database";
import { Service } from "../types";
import { logger } from "../utils/log";

let reactions: Reaction[] = [];

const ReactionService: Service = async (client) => {
  client.on("messageCreate", async (msg) => {
    try {
      if (msg.author.bot) return;

      for (const reaction of reactions) {
        if (msg.guildId !== reaction.serverId) continue;

        const regex = new RegExp(reaction.trigger);

        if (!regex.test(msg.content.toLowerCase())) {
          continue;
        }

        const rand = Math.random();
        if (rand > reaction.chance) {
          continue;
        }

        msg.react(reaction.emoji);
      }
    } catch (error) {
      logger.error("Command failed", error);
      msg.channel.send(
        "Internal error occurred, can someone fucking fix this shit??"
      );
    }
  });

  await loadReactions();

  logger.info("ReactionService initialized");
};

export async function loadReactions() {
  reactions = await getReactions();
  logger.info(`Loaded ${reactions.length} reactions`);
}

export default ReactionService;
