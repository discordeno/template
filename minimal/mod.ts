import { dotEnvConfig, createBot, startBot } from "./deps.ts";

console.log("Starting Bot, this might take a while...");

dotEnvConfig({ export: true });

const bot = createBot({
  token: Deno.env.get("BOT_TOKEN") as string,
  botId: Deno.env.get("BOT_ID") as unknown as bigint,
  intents: [],
  events: {
    ready() {
      console.log("Bot Ready!");
    }
  }
});

startBot(bot);
