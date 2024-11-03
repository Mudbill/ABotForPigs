import { Message, PermissionsBitField } from "discord.js";
import { addReaction, getReactions, removeReaction } from "../db/database";
import { Arguments } from "yargs-parser";
import Mexp from "math-expression-evaluator";
import { Command } from "../types";
import { cmonEmoji, thatsFuckingItEmoji } from "../utils/emojis";
import { loadReactions } from "../services/react-service";

const ReactionCommand: Command = {
  alias: "reaction",
  permission: PermissionsBitField.Flags.Administrator,
  argOptions: {
    alias: {
      trigger: ["t"],
      chance: ["c"],
      emoji: ["e"],
    },
    string: ["trigger", "chance", "emoji"],
  },
  exec: async (msg, args) => {
    if (msg.author.bot) return;

    if (!msg.channel.isSendable()) {
      return;
    }

    if (!args._[0]) {
      return msg.channel.send(
        'to add: `$reaction add --trigger Sabatu --chance 1/1000 --emoji "🙂"`\n' +
          "to list: `$reaction list`\n" +
          "to remove, first list then copy ID and `$reaction remove <id>`"
      );
    }

    if (!msg.guildId) return msg.channel.send("Unknown server");

    if (args._[0] === "list") {
      return list(msg);
    }

    if (args._[0] === "add") {
      return add(msg, args);
    }

    if (args._[0] === "remove") {
      return remove(msg, args);
    }
  },
};

async function remove(msg: Message, args: Arguments) {
  if (!msg.channel.isSendable()) {
    return;
  }
  const id = args._[1];
  if (!id) {
    return msg.channel.send("Gimme da ID");
  }
  const result = await removeReaction(`${id}`, msg.guildId!);
  if (result) {
    msg.channel.send("Removed " + id);
    loadReactions();
  } else {
    msg.channel.send("Invalid ID");
  }
}

async function list(msg: Message) {
  if (!msg.channel.isSendable()) {
    return;
  }
  const result = (await getReactions()).filter(
    (p) => p.serverId === msg.guildId
  );
  if (!result.length) {
    msg.channel.send("_No reactions added_");
    return;
  }

  const separateMessages = [""];
  let messageCount = 1;

  for (const reaction of result) {
    let str = `${reaction._id}\n -t "${reaction.trigger}" -c ${reaction.chance} -e "${reaction.emoji}"`;

    if (separateMessages[messageCount - 1].length + str.length >= 1980) {
      messageCount++;
      separateMessages.push("");
    }

    separateMessages[messageCount - 1] += "\n\n" + str;
  }

  for (const message of separateMessages) {
    msg.channel.send("```" + message + "```");
  }
}

async function add(msg: Message, args: Arguments) {
  if (!msg.channel.isSendable()) {
    return;
  }
  const { trigger = "", chance = "", emoji = "" } = args;

  if (!trigger) {
    return msg.channel.send(
      `Missing trigger word ${thatsFuckingItEmoji} set with -t or --trigger`
    );
  }

  try {
    const regex = new RegExp(trigger);
  } catch (e) {
    return msg.channel.send("That regex will fuck me up bro");
  }

  if (!chance) {
    return msg.channel.send(
      "No chance means never dumbass, set with -c or --chance"
    );
  }
  if (!emoji) {
    return msg.channel.send(
      `What do I even react with? ${cmonEmoji} set a reaction with -e or --emoji`
    );
  }

  try {
    await msg.react(emoji);
  } catch (error) {
    return msg.channel.send(
      `Bro, I'm not even in that server, give me something I can actually access ${cmonEmoji}`
    );
  }

  let evaluatedChance: number;

  if (chance.includes("%")) {
    evaluatedChance = parseFloat(chance) / 100;
  } else {
    const mexp = new Mexp();
    evaluatedChance = mexp.eval(chance);
  }

  evaluatedChance = Math.max(0, Math.min(evaluatedChance, 1));

  const result = await addReaction({
    chance: evaluatedChance,
    emoji: `${emoji}`,
    trigger: `${trigger}`,
    serverId: msg.guildId!,
  });

  if (result._id) {
    msg.channel.send("Added phrase. See all with `--phrase list`");
    loadReactions();
  }
}

export default ReactionCommand;
