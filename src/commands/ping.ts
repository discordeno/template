console.log('ping command was read')
import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { bot_cache } from "../../mod.ts"

export const ping_command = (message: Message) => {
	return message.channel().send_message()
}

bot_cache.commands.set(`ping`, {
	callback: ping_command
})
