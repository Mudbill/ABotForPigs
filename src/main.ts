import { Client, GatewayIntentBits } from "discord.js";
import listeners from "./listeners";
import { logger } from "./util/log";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  logger.info(`Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.BOT_TOKEN);

for (const listener of listeners) {
  listener(client);
}

logger.info(`Loaded ${listeners.length} listeners`);

process.on("unhandledRejection", (e) => {
  logger.error(e);
});
