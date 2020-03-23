import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/message.ts";

export interface Command {
	guild_only?: boolean
	nsfw?: boolean
	callback: (message: Message, args: string[]) => unknown
}
