import { Message, PermissionsBitField } from "discord.js";
import { youtube } from "scrape-youtube";

/** Cache of users currently using youtube search */
const users: Record<
  string,
  {
    timeout: NodeJS.Timeout;
    destroy: () => void;
  }
> = {};

const YtCommand: Command = {
  alias: "yt",
  permission: PermissionsBitField.Flags.SendMessages,
  exec: async (msg, args) => {
    if (!msg.channel.isSendable()) {
      return;
    }
    if (!args._.length) {
      msg.channel.send("<:cmon_tired:820326776562778133> Missing search query");
      return;
    }

    const query = args._.join(" ");

    const reply = await msg.channel.send({
      content: `>${query}`,
      embeds: [
        {
          description:
            "<a:loading:820326540620857375> Connecting to Youtube...",
        },
      ],
    });

    const { videos } = await youtube.search(query);
    if (!videos.length) {
      reply.edit({
        content: "No results, try searching something less retarded next time",
        embeds: [],
      });
      return;
    }

    reply.edit({
      content: videos[0].link,
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
        if (videos.length <= index) {
          console.warn("exceeded array. i=", index, " l=", videos.length);
          index = videos.length - 1;
          return;
        }

        return await reply.edit({
          content: videos[index].link,
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
          content: videos[index].link,
        });
      }
    }

    function cb(m: Message) {
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

export default YtCommand;
