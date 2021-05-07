import { cache, ChannelTypes, snowflakeToBigint } from "../../deps.ts";
import { bot } from "../../cache.ts";

const textChannelTypes = [
  ChannelTypes.GuildText,
  ChannelTypes.GuildNews,
  ChannelTypes.GuildNewsThread,
  ChannelTypes.GuildPivateThread,
  ChannelTypes.GuildPublicThread,
];
bot.arguments.set("guildtextchannel", {
  name: "guildtextchannel",
  execute: function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = cache.guilds.get(message.guildId);
    if (!guild) return;

    const channelIdOrName = id.startsWith("<#")
      ? id.substring(2, id.length - 1)
      : id.toLowerCase();

    const channel = cache.channels.get(snowflakeToBigint(channelIdOrName)) ||
      cache.channels.find(
        (channel) =>
          channel.name === channelIdOrName && channel.guildId === guild.id,
      );

    if (!channel?.type || !textChannelTypes.includes(channel.type)) {
      return;
    }

    return channel;
  },
});
