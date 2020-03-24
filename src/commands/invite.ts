import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts"
import { bot_cache, Bot_Options } from "../../mod.ts"

export const invite_command = (message: Message) => {
  // Replace the permission number at the end to request the permissions you wish to request. By default, this will request Admin perms.
  return message.channel().send_message(`https://discordapp.com/oauth2/authorize?client_id=${Bot_Options.bot_id}&scope=bot&permissions=8`)
}

bot_cache.commands.set(`invite`, {
  callback: invite_command
})
