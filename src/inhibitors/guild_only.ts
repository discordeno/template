import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/return-type.ts"
import { Command } from "../types/commands.ts"
import { bot_cache } from "../../mod.ts"

export const guild_only_inhibitor = (message: Message, command: Command, guild: Guild | undefined) => {
  // If this command does not need the inhibitor returns false so the command can run
  if (!command.guild_only) return false

  // Since a guild exists, we return false so the command runs
  if (guild) return false
  
  // Command requires a guild but there was no guild, so inhibit the command.
  return true
}

bot_cache.inhibitors.set('nsfw', nsfw_inhibitor)
