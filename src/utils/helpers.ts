import { Command } from "../types/commands.ts";
import { Embed } from "./Embed.ts";
import {
  botCache,
  Collection,
  MessageContent,
  Message,
  sendMessage,
  deleteMessageByID,
  editMessage,
  cache,
} from "../../deps.ts";
import { Milliseconds } from "./constants/time.ts";

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function humanizeMilliseconds(milliseconds: number) {
  // Gets ms into seconds
  const time = milliseconds / 1000;
  if (time < 1) return "1s";

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

/** This function helps convert a string like 1d5h to milliseconds. */
export function stringToMilliseconds(text: string) {
  const matches = text.match(/(\d+[w|d|h|m]{1})/g);
  if (!matches) return;

  let total = 0;

  for (const match of matches) {
    // Finds the first of these letters
    const validMatch = /(w|d|h|m|s)/.exec(match);
    // if none of them were found cancel
    if (!validMatch) return;
    // Get the number which should be before the index of that match
    const number = match.substring(0, validMatch.index);
    // Get the letter that was found
    const [letter] = validMatch;
    if (!number || !letter) return;

    let multiplier = Milliseconds.SECOND;
    switch (letter.toLowerCase()) {
      case `w`:
        multiplier = Milliseconds.WEEK;
        break;
      case `d`:
        multiplier = Milliseconds.DAY;
        break;
      case `h`:
        multiplier = Milliseconds.HOUR;
        break;
      case `m`:
        multiplier = Milliseconds.MINUTE;
        break;
    }

    const amount = number ? parseInt(number, 10) : undefined;
    if (!amount) return;

    total += amount * multiplier;
  }

  return total;
}

export function createCommand(command: Command) {
  botCache.commands.set(command.name, command);
}

export function createSubcommand(commandName: string, subcommand: Command, retries = 0) {
  const names = commandName.split("-");

  let command = botCache.commands.get(commandName);

  if (names.length > 1) {
    for (const name of names) {
      const validCommand = command ? command.subcommands?.get(name) : botCache.commands.get(name);
      if (!validCommand) break;

      command = validCommand;
    }
  }

  if (!command) {
    // If 10 minutes have passed something must have been wrong
    if (retries === 20) {
      return console.error(`Subcommand ${subcommand} unable to be created for ${commandName}`);
    }

    // Try again in 30 seconds in case this command file just has not been loaded yet.
    setTimeout(() => createSubcommand(commandName, subcommand, retries++), 30000);
    return;
  }

  if (!command.subcommands) {
    command.subcommands = new Collection();
  }

  command.subcommands.set(subcommand.name, subcommand);
}

/** Use this function to send an embed with ease. */
export function sendEmbed(channelID: string, embed: Embed, content?: string) {
  return sendMessage(channelID, { content, embed });
}

/** Use this function to edit an embed with ease. */
export function editEmbed(message: Message, embed: Embed, content?: string) {
  return editMessage(message, { content, embed });
}

// Very important to make sure files are reloaded properly
let uniqueFilePathCounter = 0;
/** This function allows reading all files in a folder. Useful for loading/reloading commands, monitors etc */
export async function importDirectory(path: string) {
  const files = Deno.readDirSync(Deno.realPathSync(path));

  for (const file of files) {
    if (!file.name) continue;

    const currentPath = `${path}/${file.name}`;
    if (file.isFile) {
      await import(`file:///${currentPath}#${uniqueFilePathCounter}`);
      continue;
    }

    await importDirectory(currentPath);
  }
  uniqueFilePathCounter++;
}

export function getTime() {
  const now = new Date();
  const hours = now.getHours();
  const minute = now.getMinutes();

  let hour = hours;
  let amOrPm = `AM`;
  if (hour > 12) {
    amOrPm = `PM`;
    hour = hour - 12;
  }

  return `${hour >= 10 ? hour : `0${hour}`}:${minute >= 10 ? minute : `0${minute}`} ${amOrPm}`;
}

export function getCurrentLanguage(guildID: string) {
  return botCache.guildLanguages.get(guildID) || cache.guilds.get(guildID)?.preferredLocale || 'en_US';
}
