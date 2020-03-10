import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/return-type.ts"
import { Command } from "../types/commands.ts"
import { bot_cache } from "../../mod.ts"

export const nsfw_inhibitor = (message: Message, command: Command, guild: Guild | undefined) => {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.nsfw) return false

  // DMs are not considered NSFW channels by Discord so we return true to cancel nsfw commands on dms
  if (!guild) return true

  // Checks if this channel is nsfw on or off
  const is_nsfw = message.channel()?.nsfw()
  // if it is a nsfw channel return false so the command runs otherwise return true to inhibit the command
  return !is_nsfw
}

bot_cache.inhibitors.set('nsfw', nsfw_inhibitor)
