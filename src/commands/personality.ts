import { PermissionsBitField } from "discord.js";
import { Command } from "../types";
import { chatCache, dynamicPersonality } from "../services/gemini-service";

const PersonalityCommand: Command = {
  alias: "personality",
  permission: PermissionsBitField.Flags.Administrator,
  exec: async (msg, args) => {
    const prompt = args._.join(" ");
    dynamicPersonality.current = prompt;
    chatCache.clear();
    await msg.reply("Alright");
  },
};

export default PersonalityCommand;
