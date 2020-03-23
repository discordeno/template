import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/return-type.ts"

export interface Command {
  dm_only?: boolean
  guild_only?: boolean
  nsfw?: boolean
  callback: (message: Message, args: string[], guild?: Guild) => unknown
}
