import commands from "../commands";
import botConfig from "../config/bot.config";
import yargsParser from "yargs-parser";
import { console } from "../util/log";

/** Stores a cache of commands in memory */
const commandMap: Map<string, Command> = new Map();

export const CommandListener: Listener = async (client) => {
  for (const command of commands) {
    if (commandMap.has(command.alias)) {
      console.error(`Duplicate command ${command.alias}`);
      continue;
    }

    commandMap.set(command.alias, command);
  }
  console.info(`Loaded ${commandMap.size} commands`);

  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
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

    const command = commandMap.get(alias);
    if (!command) return;
    if (!msg.member?.permissions.has(command.permission)) {
      msg.reply("you're not my mom");
      return;
    }

    const args = yargsParser(content.slice(alias.length), command.argOptions);

    try {
      await command.exec(msg, args);
    } catch (error) {
      console.error("Command failed", error);
      msg.channel.send(
        "Internal error occurred, can someone fucking fix this shit??"
      );
    }
  });

  console.info("CommandListener initialized");
};

export default CommandListener;
