import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { logGreen, logRed } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/utils/logger.ts"
import { configs } from "../../configs.ts"
import { bot_cache } from "../../mod.ts"
import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/utils/cache.ts"
export const command_handler = async (message: Message) => {
  // If the message was sent by a bot we can just ignore it
  if (message.author().bot()) return

  const guild_id = message.guild_id()

  // Check what the valid prefix is supposed to be for the bot for this guild
  const prefix = check_prefix(message, guild_id)
  // If the message is not using the valid prefix cancel the command
  if (!message.content().startsWith(prefix)) return

  // Get the first word of the message without the prefix so it is just command name. `!ping testing` becomes `ping`
  const [command_name, ...args] = message
    .content()
    .substring(prefix.length)
    .split(" ")

  // Check if this is a valid command
  const command = check_command(command_name)
  if (!command) return

  const guild = guild_id ? cache.guilds.get(guild_id) : undefined
  log_command(message, guild?.name() || "DM", "Ran")
  const inhibitor_results = await Promise.all(
    [...bot_cache.inhibitors.values()].map(inhibitor => inhibitor(message, command, guild))
  )

  if (inhibitor_results.includes(true)) return log_command(message, guild?.name() || "DM", "Inhibibted")

  try {
    await command.callback(message, args)
    // Log that the command ran successfully.
    log_command(message, guild?.name() || "DM", "Success")
  } catch (error) {
    log_command(message, guild?.name() || "DM", "Failed")
    logRed(error)
  }
}

export const check_prefix = (message: Message, guild_id: string | undefined) => {
  const prefix = guild_id ? bot_cache.guild_prefixes.get(guild_id) : configs.prefix
  return prefix || configs.prefix
}

export const check_command = (command_name: string) => {
  const command = bot_cache.commands.get(command_name)
  if (command) return command

  // Check aliases if the command wasn't found
  const alias = bot_cache.command_aliases.get(command_name)
  if (!alias) return

  return bot_cache.commands.get(alias)
}

export const log_command = (message: Message, guild_name: string, type: string) => {
  logGreen(`[COMMAND - ${type}] by ${message.author().tag()} in ${guild_name}`)
}
