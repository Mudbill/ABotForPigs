import { Client, GatewayIntentBits } from "discord.js";
import botConfig from "./config/bot.config";
import listeners from "./listeners";
import { console } from "./util/log";

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
  console.info(`Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(botConfig.token);

for (const listener of listeners) {
  listener(client);
}

console.info(`Loaded ${listeners.length} listeners`);
