import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/guild.ts";
import logger from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/utils/logger.ts";

export const guildCreate = (guild: Guild) => {
  logger.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
