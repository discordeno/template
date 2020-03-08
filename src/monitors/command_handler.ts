import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { logGreen } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/utils/logger.ts"
import { configs } from "../../configs.ts"
import { bot_cache } from "../../mod.ts"

export const command_handler = (message: Message) => {
  // If the message was sent by a bot we can just ignore it
  if (message.author().bot()) return

  const prefix = check_prefix(message)
  if (!message.content().startsWith(prefix)) return

  logGreen(`[COMMAND] ${message.content()}`)
}

export const check_prefix = (message: Message) => {
  const guild_id = message.guild_id()
  const prefix = guild_id ? bot_cache.guild_prefixes.get(guild_id) : configs.prefix
  return prefix || configs.prefix
}
