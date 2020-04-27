import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"

export interface Command {
  dmOnly?: boolean
  guildOnly?: boolean
  nsfw?: boolean
  callback: (message: Message, args: string[], guild?: Guild) => unknown
}
