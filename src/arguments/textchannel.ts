import { botCache } from "../../deps.ts";
import { cache, ChannelTypes } from "../../deps.ts";

botCache.arguments.set("textchannel", {
  name: "textchannel",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    const channelIDOrName = id.startsWith("<#")
      ? id.substring(2, id.length - 1)
      : id.toLowerCase();

    const channel = guild.channels.get(channelIDOrName) ||
      guild.channels.find((channel) => channel.name === channelIDOrName);

    if (channel?.type !== ChannelTypes.GUILD_TEXT) return;

    return channel;
  },
});
