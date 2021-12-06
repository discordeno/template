import { ApplicationCommandTypes } from "../../deps.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "ping",
  description: "Ping the Bot!",
  type: ApplicationCommandTypes.ChatInput,
  scope: "Global",
  execute: async (bot, message) => {
    await bot.helpers.sendMessage(message.channelId, `Ping MS: ${Date.now() - message.timestamp}ms`);
  }
});
