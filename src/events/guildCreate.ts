import type { Guild } from "../../deps.ts";

export const guildCreate = (guild: Guild) => {
  console.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
