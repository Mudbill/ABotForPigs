import { ChannelType, PermissionsBitField } from "discord.js";

const PinLimitCommand: Command = {
  alias: "pinlimit",
  permission: PermissionsBitField.Flags.SendMessages,
  exec: async (msg, args) => {
    if (!msg.channel.isSendable()) {
      return;
    }
    await msg.channel.send("Ok let's see...");

    const pins = await msg.channel.messages.fetchPinned();

    if (pins.size !== 50) {
      msg.channel.send(
        "Wait, this channel ain't full of pins yet, how about you stop wasting everyone's time and resources huh"
      );
      return;
    }

    // If max pins, rotate channel

    const channel = msg.channel;

    if (channel.type !== ChannelType.GuildText) {
      msg.channel.send("Man, fuck this");
      return;
    }

    await msg.channel.send("Rotating channel...");

    const cloned = await channel.clone();

    cloned.send(`Sup bitches, I just came from <#${msg.channelId}>`);

    msg.channel.send(`Ok, new channel is over here: <#${cloned.id}>`);

    const category = msg.guild?.channels.cache.find((c) =>
      c.name.toLowerCase().includes("archive")
    );

    if (category?.type !== ChannelType.GuildCategory) {
      msg.channel.send(
        "HOL UP, HALP, I DUN UNDASTAN, I CANT FIND THE ARCHIVE, HALP (move the channel manually pls)"
      );
      return;
    }

    channel.setParent(category.id);
  },
};

export default PinLimitCommand;
