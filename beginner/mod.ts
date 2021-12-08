import { bgBlack, createBot, fastFileLoader, startBot, white } from "./deps.ts";
import { configs } from "./configs.ts";
import { logger } from "./src/utils/logger.ts";
import { customCache } from "./src/cache.ts";

const log = logger({ name: "Main" });

log.info("Starting bot, this might take a while...");

// Import (almost) All Of ./src
const paths = [
  "./src/commands",
  // "./src/database",
  "./src/events",
];

await fastFileLoader(paths, (path) => {
  log.info(
    `Importing: ${
      // Output a capitalized version of the directory that is being imported.
      bgBlack(
        white(
          path.split("/")[path.split("/").length - 1].toLowerCase().replace(
            /\w\S*/g,
            (w) => (w.replace(/^\w/, (c) => c.toUpperCase())),
          ),
        ),
      )
    }`,
  );
}, () => {
  log.info(`Finishing Imports`);
}).then(() => {
  log.info(`Finished Importing ${paths.length} Directories`);
});

export const bot = createBot({
  token: configs.token,
  botId: configs.botId,
  intents: [],
  events: customCache.events,
});

startBot(bot);
