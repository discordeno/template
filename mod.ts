import Client from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/module/client.ts"
import { configs } from "./configs.ts"
import { Intents } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/options.ts"
import { event_handlers } from "./src/events/event_handlers.ts"
import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/return-type.ts"
import { Command } from "./src/types/commands.ts"

export const Bot = new Client({
  token: configs.token,
  // Replace this with your bot's ID.
  bot_id: "675412054529540107",
  // Pick the intents you wish to have for your bot.
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  // These are all your event handler functions. Currently, being imported from a file called event_handlers from the events folder
  event_handlers
})

export const bot_cache = {
  commands: new Map<string, Command>(),
  command_aliases: new Map<string, string>(),
  guild_prefixes: new Map<string, string>(),
  inhibitors: new Map<string, (message: Message, command: Command, guild: Guild | undefined) => boolean>()
}

Deno.readDirSync('')
