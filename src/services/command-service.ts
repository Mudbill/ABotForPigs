import botConfig from "../config/bot.config";
import yargsParser from "yargs-parser";
import { logger } from "../utils/log";
import { Service } from "../types";
import { commands } from "../features";

export const CommandService: Service = async (client) => {
  logger.info(`Loaded ${commands.size} commands`);

  client.on("messageCreate", async (msg) => {
    // Ignore messages from other bots (so we don't get infinite bot loops)
    if (msg.author.bot) return;

    // Ignore DMs
    if (msg.channel.isDMBased()) return;

    let content = msg.content.trim();

    let hasPrefix = false;
    for (const prefix of botConfig.prefixes) {
      if (content.startsWith(prefix)) {
        hasPrefix = true;
        content = content.slice(prefix.length);
        break;
      }
    }
    if (!hasPrefix) return;

    const alias = content.split(" ")[0];

    const command = commands.get(alias);
    if (!command) return;
    if (!msg.member?.permissions.has(command.permission)) {
      msg.reply("you're not my mom");
      return;
    }

    const args = yargsParser(content.slice(alias.length), command.argOptions);

    try {
      await command.exec(msg, args);
    } catch (error) {
      logger.error("Command failed", error);
      msg.channel.send(
        "Internal error occurred, can someone fucking fix this shit??"
      );
    }
  });

  logger.info("CommandListener initialized");
};

export default CommandService;
