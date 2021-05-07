import { snowflakeToBigint } from "../../deps.ts";
import { processReactionCollectors } from "../utils/collectors.ts";
import { bot } from "../../cache.ts";

bot.eventHandlers.reactionAdd = function (data, message) {
  // Process reaction collectors.
  if (message) {
    processReactionCollectors(
      message,
      data.emoji,
      snowflakeToBigint(data.userId),
    );
  }
};
