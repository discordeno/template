import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message.ts";
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/guild.ts";

export interface Command {
  dmOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  callback: (message: Message, args: string[], guild?: Guild) => unknown;
}
