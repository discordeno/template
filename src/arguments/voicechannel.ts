import { botCache, cache, ChannelTypes } from "../../deps.ts";

botCache.arguments.set("voicechannel", {
  name: "voicechannel",
  execute: async function (_argument, parameters, message) {
    const [channelIDOrName] = parameters;
    if (!channelIDOrName) return;

    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    const channel = guild.channels.get(channelIDOrName) ||
      guild.channels.find((channel) => channel.name === channelIDOrName);

    if (channel?.type !== ChannelTypes.GUILD_VOICE) return;

    return channel;
  },
});
