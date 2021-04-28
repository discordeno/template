import { bot } from "../../deps.ts";

bot.eventHandlers.guildCreate = function (guild) {
  console.log(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
