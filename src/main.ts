import { Client, GatewayIntentBits } from "discord.js";
import { logger } from "./utils/log";
import { services } from "./features";

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

for (const service of services) {
  service(client);
}

logger.info(`Loaded ${services.length} listeners`);

process.on("unhandledRejection", (e) => {
  logger.error(e);
});
