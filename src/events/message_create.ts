import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { command_handler } from "../monitors/command_handler.ts"

export const message_create = (message: Message) => {
  command_handler(message)
}
