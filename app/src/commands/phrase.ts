import { Message, Permissions } from "discord.js";
import { all, create } from "mathjs";
import Command from "../../@types/Command";
import { loadPhrases } from "../listeners/PhraseListener";
import { addPhrase, getPhrases, removePhrase } from "../util/db";

const math = create(all, {});

const command: Command = {
  command: "phrase",
  description: "Add a response to a phrase",
  permission: Permissions.FLAGS.SEND_MESSAGES,
  exec: async (args, msg) => {
    if (!args[0] || args[0] === "help" || args[0] === "-h") return help(msg);
    if (args[0] === "list") {
      const result = await getPhrases();
      if (result.length === 0) return msg.channel.send("_No phrases added_");
      let reply: string[] = [];
      for (const phrase of result) {
        reply.push(
          `\`${phrase._id}\`: trigger=${phrase.trigger} chance=${phrase.chance} reply=${phrase.reply}`
        );
      }
      return msg.channel.send(["Phrases: ", ...reply]);
    }
    if (args[0] === "add") {
      const result = await add(args, msg);
      if (result._id) {
        msg.channel.send("Added phrase. See all with `--phrase list`");
        loadPhrases();
      }
    }
    if (args[0] === "remove" || args[0] === "delete") {
      const id = args[1];
      if (!id) return msg.channel.send("Gimme da ID");
      const result = await removePhrase(id);
      if (result) {
        msg.channel.send("Removed " + id);
        loadPhrases();
      } else msg.channel.send("Invalid ID");
    }
  },
};

async function add(args: string[], msg: Message) {
  const data = {
    chance: 0,
    trigger: "",
    reply: "",
  };

  for (let i = 0; i < args.length; ++i) {
    const arg = args[i];

    if (arg.startsWith("chance=")) {
      const expr = arg.slice("chance=".length);
      const chanceEval = math.evaluate(expr);
      if (typeof chanceEval === "number") {
        data.chance = Math.max(0, Math.min(chanceEval, 1));
      }
    }

    if (arg.startsWith("trigger=")) {
      data.trigger = arg.slice("trigger=".length);
    }

    if (arg.startsWith("reply=")) {
      data.reply = arg.slice("reply=".length);
      data.reply = data.reply + " " + args.slice(i + 1).join(" ");
    }
  }

  if (!data.chance) return msg.channel.send(`0 chance means never, dumbass`);
  if (!data.trigger)
    return msg.channel.send(
      "Missing trigger word <:thats_fucking_it:940010467571683338>"
    );
  if (!data.reply)
    return msg.channel.send("What do I even say? <:cmon:820326876719218769>");

  return await addPhrase(data);
}

function help(msg: Message) {
  msg.channel.send(
    "missing args\nadd: `--phrase add trigger=Sabatu chance=1/1000 reply=I am bitch :)`\n"
  );
}

export default command;
