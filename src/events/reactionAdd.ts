import { botCache } from "../../mod.ts";
import { processReactionCollectors } from "../utils/collectors.ts";

botCache.eventHandlers.reactionAdd = function (message, emoji, userID) {
  // Process reaction collectors.
  processReactionCollectors(message, emoji, userID);
};
