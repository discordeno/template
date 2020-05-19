import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v2/structures/guild.ts";
import { logGreen } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v2/utils/logger.ts";

export const guildCreate = (guild: Guild) => {
  logGreen(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
