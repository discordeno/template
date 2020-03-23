import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/return-type.ts"
import { Command } from "../types/commands.ts"
import { bot_cache } from "../../mod.ts"

export const only_in_inhibitor = (message: Message, command: Command, guild: Guild | undefined) => {
  // If the command is guild_only and does not have a guild, inhibit the command
  if (command.guild_only && !guild) return true
  // If the command is dm_only and there is a guild, inhibit the command
  if (command.dm_only && guild) return true
  
  // The command should be allowed to run because it meets the requirements
  return false
}

bot_cache.inhibitors.set('only_in', only_in_inhibitor)
