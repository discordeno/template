import { Guild, logger } from "../../deps.ts";

export const guildCreate = (guild: Guild) => {
  logger.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
