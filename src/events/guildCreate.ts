import { bot } from "../../cache.ts";

bot.eventHandlers.guildCreate = function (guild) {
  console.log(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
