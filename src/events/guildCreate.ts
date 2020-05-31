import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/guild.ts";
import logger from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/logger.ts";

export const guildCreate = (guild: Guild) => {
  logger.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
