import { guild_create } from './guild_create.ts'
import { Event_Handlers } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/types/options.ts"
import { ready } from './ready.ts'
import { message_create } from './message_create.ts'

export const event_handlers: Event_Handlers = {
	guild_create,
	ready,
	message_create
}
