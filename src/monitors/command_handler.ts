import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { logGreen } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/utils/logger.ts"

export const command_handler = (message: Message) => {
  logGreen(`[COMMAND] ${message.content()}`)
}
