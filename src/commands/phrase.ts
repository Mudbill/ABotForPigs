import { Message, PermissionsBitField } from "discord.js";
import { addPhrase, getPhrases, removePhrase } from "../database";
import { create, all } from "mathjs";
import { loadPhrases } from "../listeners/PhraseListener";
import { Arguments } from "yargs-parser";

const math = create(all, {});

const PhraseCommand: Command = {
  alias: "phrase",
  permission: PermissionsBitField.Flags.Administrator,
  argOptions: {
    alias: {
      trigger: ["t"],
      chance: ["c"],
      reply: ["r"],
      blacklist: ["B"],
      channel: ["C"],
      flash: ["F"],
    },
    array: ["channel"],
    string: ["trigger", "chance", "reply"],
    boolean: ["whitelist"],
  },
  exec: async (msg, args) => {
    if (!args._[0]) {
      return msg.channel.send(
        'to add: `$phrase add --trigger Sabatu --chance 1/1000 --reply "I am bitch :)"`\n' +
          "to list: `$phrase list`\n" +
          "to remove, first list then copy ID and `$phrase remove <id>`"
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
  const id = args._[1];
  if (!id) {
    return msg.channel.send("Gimme da ID");
  }
  const result = await removePhrase(`${id}`, msg.guildId!);
  if (result) {
    msg.channel.send("Removed " + id);
    loadPhrases();
  } else {
    msg.channel.send("Invalid ID");
  }
}

async function list(msg: Message) {
  const result = (await getPhrases()).filter((p) => p.serverId === msg.guildId);
  if (!result.length) {
    msg.channel.send("_No phrases added_");
    return;
  }
  const reply: string[] = [];
  for (const phrase of result) {
    let str = `\`${phrase._id}\` -t "${phrase.trigger}" -c ${phrase.chance} -r "${phrase.reply}"`;
    if (phrase.channels?.length) {
      for (const channel of phrase.channels) {
        str += ` -C ${channel}`;
      }
    }
    if (phrase.blacklist) str += " -B";
    if (phrase.flash) str += " -F";
    reply.push(str);
  }
  const joinedMessage = reply.join("\n");
  if (joinedMessage.length > 2000) {
    msg.channel.send("List is over 2k chars!");
  }
  msg.channel.send(joinedMessage.slice(0, 2000));
  return;
}

async function add(msg: Message, args: Arguments) {
  const {
    trigger = "",
    chance = "",
    reply = "",
    channel: channels = [],
    blacklist = false,
    flash = false,
  } = args;

  if (!trigger) {
    return msg.channel.send(
      "Missing trigger word <:thats_fucking_it:940010467571683338> set with -t or --trigger"
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
  if (!reply) {
    return msg.channel.send(
      "What do I even say? <:cmon:820326876719218769> set a reply with -r or --reply"
    );
  }

  for (const channel of channels) {
    if (typeof channel !== "string") return;
    let chnl = channel.slice(2, -1);

    if (!msg.guild?.channels.cache.has(chnl)) {
      return msg.channel.send("Channel not found: " + channel);
    }
  }

  let evaluatedChance = math.evaluate(`${chance}`);
  if (typeof evaluatedChance === "number") {
    evaluatedChance = Math.max(0, Math.min(evaluatedChance, 1));
  }

  const result = await addPhrase({
    chance: evaluatedChance,
    reply: `${reply}`,
    trigger: `${trigger}`,
    serverId: msg.guildId!,
    channels,
    blacklist: Boolean(blacklist),
    flash: Boolean(flash),
  });

  if (result._id) {
    msg.channel.send("Added phrase. See all with `--phrase list`");
    loadPhrases();
  }
}

export default PhraseCommand;
