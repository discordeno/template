// This task will help remove un-used collectors to help keep our cache optimized.
import { botCache } from "../../cache.ts";
import { Milliseconds } from "../utils/constants/time.ts";

botCache.tasks.set(`collectors`, {
  name: `collectors`,
  // Runs this function once a minute
  interval: Milliseconds.MINUTE,
  // deno-lint-ignore require-await
  execute: async function () {
    const now = Date.now();

    botCache.messageCollectors.forEach((collector, key) => {
      // This collector has not finished yet.
      if ((collector.createdAt + collector.duration) > now) return;

      // Remove the collector
      botCache.messageCollectors.delete(key);
      // Reject the promise so code can continue in commands.
      return collector.reject();
    });

    botCache.reactionCollectors.forEach((collector, key) => {
      // This collector has not finished yet.
      if ((collector.createdAt + collector.duration) > now) return;

      // Remove the collector
      botCache.reactionCollectors.delete(key);
      // Reject the promise so code can continue in commands.
      return collector.reject();
    });
  },
});
