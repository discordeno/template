import { fastFileLoader, createBot, ActivityTypes, startBot } from "./deps.ts";
import { BOT_TOKEN, BOT_ID } from "./configs.ts";
import { logger } from "./src/utils/logger.ts";
import { events } from "./src/events/mod.ts";

const log = logger({ name: "Main" });

log.info("Starting Bot, this might take a while...");

const paths = ["./src/events", "./src/commands"];
await fastFileLoader(paths).catch((err) => {
  log.fatal(`Unable to Import ${paths}`);
  log.fatal(err);
  Deno.exit(1);
});

const bot = createBot({
  token: BOT_TOKEN,
  botId: BOT_ID,
  intents: [],
  events
});

bot.gateway.presence = {
  status: "online",
  activities: [
    {
      name: "Discordeno is Best Lib",
      type: ActivityTypes.Game,
      createdAt: Date.now()
    }
  ]
};

startBot(bot);
