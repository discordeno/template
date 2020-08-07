import Client from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/module/client.ts";
import { configs } from "./configs.ts";
import {
  Intents,
  EventHandlers,
} from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/types/options.ts";
import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/message.ts";
import { Command, Argument } from "./src/types/commands.ts";
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/guild.ts";
import { importDirectory } from "./src/utils/helpers.ts";
import { Monitor } from "./src/types/monitors.ts";
import { Task } from "./src/types/tasks.ts";

export const botCache = {
  commands: new Map<string, Command>(),
  commandAliases: new Map<string, string>(),
  guildPrefixes: new Map<string, string>(),
  inhibitors: new Map<
    string,
    (message: Message, command: Command, guild?: Guild) => Promise<boolean>
  >(),
  monitors: new Map<string, Monitor>(),
  eventHandlers: {} as EventHandlers,
  arguments: new Map<string, Argument>(),
  tasks: new Map<string, Task>()
};

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/events",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks"
  ].map(
    (path) => importDirectory(Deno.realPathSync(path)),
  ),
);

Client({
  token: configs.token,
  // Pick the intents you wish to have for your bot.
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  // These are all your event handler functions. Imported from the events folder
  eventHandlers: botCache.eventHandlers,
});
