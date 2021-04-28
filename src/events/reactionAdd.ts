import { botCache } from "../../deps.ts";
import { processReactionCollectors } from "../utils/collectors.ts";

botCache.eventHandlers.reactionAdd = function (data, message) {
  // Process reaction collectors.
  if (message) processReactionCollectors(message, data.emoji, data.userId);
};
