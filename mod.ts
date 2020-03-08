import Client from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/module/client.ts"
import { configs } from "./configs.ts"
import { Intents } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/options.ts"
import { event_handlers } from "./src/events/event_handlers.ts"

new Client({
  token: configs.token,
  bot_id: "675412054529540107",
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  event_handlers
})

export const bot_cache = {
  guild_prefixes: new Map<string, string>()
}
