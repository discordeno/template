import Client, { Message, Guild, Intents, EventHandlers } from "./deps.ts"
import { configs } from "./configs.ts";
import { Command, Argument } from "./src/types/commands.ts";
import { importDirectory } from "./src/utils/helpers.ts";
import { Monitor } from "./src/types/monitors.ts";
import { Task } from "./src/types/tasks.ts";
import { loadLanguages } from "./src/utils/i18next.ts";

export const botCache = {
  commands: new Map<string, Command>(),
  commandAliases: new Map<string, string>(),
  guildPrefixes: new Map<string, string>(),
  guildLanguages: new Map<string, string>(),
  inhibitors: new Map<
    string,
    (message: Message, command: Command, guild?: Guild) => Promise<boolean>
  >(),
  monitors: new Map<string, Monitor>(),
  eventHandlers: {} as EventHandlers,
  arguments: new Map<string, Argument>(),
  tasks: new Map<string, Task>(),
};

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/events",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks",
  ].map(
    (path) => importDirectory(Deno.realPathSync(path)),
  ),
);

// Loads languages
await loadLanguages();

Client({
  token: configs.token,
  // Pick the intents you wish to have for your bot.
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  // These are all your event handler functions. Imported from the events folder
  eventHandlers: botCache.eventHandlers,
});
