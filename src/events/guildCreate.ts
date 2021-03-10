import { botCache } from "../../deps.ts";

botCache.eventHandlers.guildCreate = function (guild) {
  console.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
