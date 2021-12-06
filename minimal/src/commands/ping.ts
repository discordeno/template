import { sendMessage, ApplicationCommandTypes } from "../../deps.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "ping",
  description: "Ping the Bot!",
  type: ApplicationCommandTypes.ChatInput,
  scope: "Global",
  execute: (bot, message) => {
    sendMessage(bot, message.channelId, `Ping MS: ${Date.now() - message.timestamp}ms`);
  }
});
