import { bot, snowflakeToBigint } from "../../deps.ts";
import { processReactionCollectors } from "../utils/collectors.ts";

bot.eventHandlers.reactionAdd = function (data, message) {
  // Process reaction collectors.
  if (message) processReactionCollectors(message, data.emoji, snowflakeToBigint(data.userId));
};
