import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message.ts";
import { Command } from "../types/commands.ts";
import { botCache } from "../../mod.ts";
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/guild.ts";

export const onlyInInhibitor = (
  message: Message,
  command: Command,
  guild?: Guild,
) => {
  // If the command is guildOnly and does not have a guild, inhibit the command
  if (command.guildOnly && !guild) return true;
  // If the command is dmOnly and there is a guild, inhibit the command
  if (command.dmOnly && guild) return true;

  // The command should be allowed to run because it meets the requirements
  return false;
};

botCache.inhibitors.set("only_in", onlyInInhibitor);
