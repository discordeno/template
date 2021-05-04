import {
  bot,
  cache,
  DiscordChannelTypes,
  snowflakeToBigint,
} from "../../deps.ts";

bot.arguments.set("newschannel", {
  name: "newschannel",
  execute: function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = cache.guilds.get(message.guildId);
    if (!guild) return;

    const channelIDOrName = id.startsWith("<#")
      ? id.substring(2, id.length - 1)
      : id.toLowerCase();

    const channel = guild.channels.get(snowflakeToBigint(channelIDOrName)) ||
      guild.channels.find((channel) => channel.name === channelIDOrName);

    if (channel?.type !== DiscordChannelTypes.GuildNews) return;

    return channel;
  },
});
