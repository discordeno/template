import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/guild.ts";
import logger from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/logger.ts";

export const guildCreate = (guild: Guild) => {
  logger.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
