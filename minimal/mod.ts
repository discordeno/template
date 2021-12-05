import { createBot, startBot } from "./deps.ts";
import { BOT_TOKEN, BOT_ID } from "./configs.ts";

console.log("Starting Bot, this might take a while...");

const bot = createBot({
  token: BOT_TOKEN,
  botId: BOT_ID,
  intents: [],
  events: {
    ready() {
      console.log("Bot Ready!");
    }
  }
});

startBot(bot);
