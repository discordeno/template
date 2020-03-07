import Client from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/module/client.ts"
import { configs } from "./configs.ts"
import { Intents } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/options.ts"

new Client({
  token: configs.token,
  bot_id: "675412054529540107",
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  event_handlers: {
    guild_create: guild => console.log(guild.name()),
    ready: () => console.log(`[READY] The bot is online!`)
  }
})
