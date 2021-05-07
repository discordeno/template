import { bot } from "./cache.ts";
import { configs } from "./configs.ts";
import { startBot } from "./deps.ts";
import { fileLoader, getTime, importDirectory } from "./src/utils/helpers.ts";
import { loadLanguages } from "./src/utils/i18next.ts";

console.log(
  getTime(),
  "Beginning Bot Startup Process. This can take a little bit depending on your system. Loading now...",
);

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
  ].map((path) => importDirectory(Deno.realPathSync(path))),
);
await fileLoader();

// Loads languages
await loadLanguages();
await import("./src/database/database.ts");

startBot({
  token: configs.token,
  // Pick the intents you wish to have for your bot.
  // For instance, to work with guild message reactions, you will have to pass the "GuildMessageReactions" intent to the array.
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
  // These are all your event handler functions. Imported from the events folder
  eventHandlers: bot.eventHandlers,
});
