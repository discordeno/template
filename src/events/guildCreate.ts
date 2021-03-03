import { botCache } from "../../cache.ts";

botCache.eventHandlers.guildCreate = function (guild) {
  console.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
