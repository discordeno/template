import type { Message, Guild } from "./deps.ts";
import type {
  Command,
  Argument,
  PermissionLevels,
} from "./src/types/commands.ts";
import type { Monitor } from "./src/types/monitors.ts";
import type { Task } from "./src/types/tasks.ts";
import type { CustomEvents } from "./src/types/events.ts";
import type {
  MessageCollector,
  ReactionCollector,
} from "./src/types/collectors.ts";

import StartBot, { Collection, Intents } from "./deps.ts";
import { configs } from "./configs.ts";
import { importDirectory } from "./src/utils/helpers.ts";
import { loadLanguages } from "./src/utils/i18next.ts";

console.info(
  "Beginning Bot Startup Process. This can take a little bit depending on your system. Loading now...",
);

export const botCache = {
  arguments: new Collection<string, Argument>(),
  commands: new Collection<string, Command>(),
  eventHandlers: {} as CustomEvents,
  guildPrefixes: new Collection<string, string>(),
  guildLanguages: new Collection<string, string>(),
  messageCollectors: new Collection<string, MessageCollector>(),
  reactionCollectors: new Collection<string, ReactionCollector>(),
  inhibitors: new Collection<
    string,
    (message: Message, command: Command, guild?: Guild) => Promise<boolean>
  >(),
  monitors: new Collection<string, Monitor>(),
  permissionLevels: new Collection<
    PermissionLevels,
    (message: Message, command: Command, guild?: Guild) => Promise<boolean>
  >(),
  tasks: new Collection<string, Task>(),
  memberLastActive: new Collection<string, number>(),
};

// Always require these files be processed before anything else
await Promise.all([
  "./src/customizations/structures",
].map(
  (path) => importDirectory(Deno.realPathSync(path)),
));

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/events",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks",
    "./src/permissionLevels",
    "./src/events",
  ].map(
    (path) => importDirectory(Deno.realPathSync(path)),
  ),
);

// Loads languages
await loadLanguages();
await import("./src/database/database.ts");

StartBot({
  token: configs.token,
  // Pick the intents you wish to have for your bot.
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  // These are all your event handler functions. Imported from the events folder
  eventHandlers: botCache.eventHandlers,
});
