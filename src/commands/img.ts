import { Message, PermissionsBitField, TextChannel } from "discord.js";
import { image_search } from "@mudbill/duckduckgo-images-api";
import { Command } from "../types";
import config from "../config";

/** Cache of users currently using image search */
const users: Record<
  string,
  {
    timeout: NodeJS.Timeout;
    destroy: () => void;
  }
> = {};

const ImgCommand: Command = {
  alias: "img",
  permission: PermissionsBitField.Flags.SendMessages,
  exec: async (msg, args) => {
    if (!msg.channel.isSendable()) {
      return;
    }

    if (!args._[0]) {
      msg.channel.send(`${config.emojis.cmonTired} Missing search query`);
      return;
    }

    const query = args._.join(" ");

    const reply = await msg.channel.send({
      content: `>${query}`,
      embeds: [
        {
          description: `${config.emojis.loading} Fetching results...`,
        },
      ],
    });

    const params = {
      query,
      moderate: true,
      iterations: 1,
      retries: 1,
    };

    if (msg.channel instanceof TextChannel) {
      if (msg.channel.nsfw) params.moderate = false;
    }

    const result = await image_search(params);
    if (!result.length) {
      reply.edit({
        content: "No results, try searching something less retarded next time",
        embeds: [],
      });
      return;
    }

    reply.edit({
      content: result[0].image,
      embeds: [],
    });

    // Set up ability to pick next and previous image in resultset

    let timeout: NodeJS.Timeout | undefined;
    let index = 0;

    async function followup(msg2: Message) {
      if (msg2.author.id !== msg.author.id) return;
      if (["n", "next"].includes(msg2.content.toLowerCase())) {
        if (timeout) timeout.refresh();

        await msg2.delete();

        ++index;
        if (result.length <= index) {
          console.warn("exceeded array. i=", index, " l=", result.length);
          index = result.length - 1;
          return;
        }

        return await reply.edit({
          content: result[index].image,
        });
      }
      if (
        ["p", "prev", "previous", "b", "back"].includes(
          msg2.content.toLowerCase()
        )
      ) {
        if (timeout) timeout.refresh();

        await msg2.delete();

        --index;
        if (index < 0) return (index = 0);

        return reply.edit({
          content: result[index].image,
        });
      }
      if (["q", "quit"].includes(msg2.content.toLowerCase())) {
        msg2.delete();
        reply.delete();
        timeIsOut();
        clearTimeout(timeout);
      }
    }

    async function cb(m: Message) {
      followup(m);
    }

    function timeIsOut() {
      msg.client.off("messageCreate", cb);
      timeout = undefined;
      delete users[msg.author.id];
    }

    if (users[msg.author.id]) {
      users[msg.author.id].destroy();
    }

    msg.client.on("messageCreate", cb);
    timeout = setTimeout(timeIsOut, 15000);

    users[msg.author.id] = {
      timeout,
      destroy: () => {
        timeIsOut();
        clearTimeout(timeout);
      },
    };
  },
};

export default ImgCommand;
