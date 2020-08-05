import { MessageContent } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/types/channel.ts";
import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/channel.ts";
import { deleteMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/message.ts";
import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/message.ts";
import { botCache } from "../../mod.ts";
import { Channel } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/channel.ts";
import { Embed } from "./Embed.ts";

/** This function should be used when you want to send a response that will @mention the user and delete it after a certain amount of seconds. By default, it will be deleted after 10 seconds. */
export async function sendAlertResponse(
  message: Message,
  content: string | MessageContent,
  timeout = 10,
  reason = "",
) {
  const response = await sendResponse(message, content);
  deleteMessage(response, reason, timeout * 1000);
}

/** This function should be used when you want to send a response that will @mention the user. */
export function sendResponse(
  message: Message,
  content: string | MessageContent,
) {
  const mention = `<@!${message.author.id}>`;
  const contentWithMention = typeof content === "string"
    ? `${mention}, ${content}`
    : { ...content, content: `${mention}, ${content.content}` };

  return sendMessage(message.channel, contentWithMention);
}

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function humanizeMilliseconds(milliseconds: number) {
  // Gets ms into seconds
  const time = milliseconds / 1000;

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor(((time % 86400) % 3600) / 60);
  const seconds = Math.floor(((time % 86400) % 3600) % 60);

  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return `${dayString}${hourString}${minuteString}${secondString}`;
}

/** This function should be used to create command aliases. */
export function createCommandAliases(
  commandName: string,
  aliases: string | string[],
) {
  if (typeof aliases === "string") aliases = [aliases];

  for (const alias of aliases) {
    if (botCache.commandAliases.has(alias)) {
      throw new Error(`The ${alias} already exists as a command alias.`);
    }
    botCache.commandAliases.set(alias, commandName);
  }
}

/** Use this function to send an embed with ease. */
export function sendEmbed(channel: Channel, embed: Embed, content?: string) {
  return sendMessage(channel, { content, embed });
}
