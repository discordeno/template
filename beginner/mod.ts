import {
  BotWithCache,
  BotWithHelpersPlugin,
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
  startBot,
} from "./deps.ts";
import { configs } from "./configs.ts";
import log from "./src/utils/logger.ts";
import { fileLoader, importDirectory } from "./src/utils/loader.ts";
import { updateApplicationCommands } from "./src/utils/updateCommands.ts";
// setup db
import "./src/database/mod.ts";

log.info("Starting bot...");

// MAKE THE BASIC BOT OBJECT
const bot = createBot({
  token: configs.token,
  botId: configs.botId,
  intents: [],
  events: {},
});

// ENABLE ALL THE PLUGINS THAT WILL HELP MAKE IT EASIER TO CODE YOUR BOT
enableHelpersPlugin(bot);
enableCachePlugin(bot);
enableCacheSweepers(bot as BotWithCache);
enablePermissionsPlugin(bot as BotWithCache);

// deno-lint-ignore no-empty-interface
export interface BotClient extends BotWithCache<BotWithHelpersPlugin> {}
// THIS IS THE BOT YOU WANT TO USE EVERYWHERE IN YOUR CODE! IT HAS EVERYTHING BUILT INTO IT!
export const Bot = bot as BotClient;

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./src/commands",
    "./src/events",
    // "./src/tasks",
  ].map((path) => importDirectory(Deno.realPathSync(path))),
);
await fileLoader();

// UPDATES YOUR COMMANDS TO LATEST COMMANDS
await updateApplicationCommands();

// STARTS THE CONNECTION TO DISCORD
await startBot(bot);
