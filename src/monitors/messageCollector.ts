import type { Message } from "../../deps.ts";
import { botCache } from "../../mod.ts";

botCache.monitors.set("messageCollector", {
  name: "messageCollector",
  /** The main code that will be run when this monitor is triggered. */
  execute: async function (message: Message) {
    const collector = botCache.messageCollectors.get(message.author.id);
    // This user has no collectors pending or the message is in a different channel
    if (!collector || message.channelID !== collector.channelID) return;
    // This message is a response to a collector. Now running the filter function.
    if (!collector.filter(message)) return;

    // If the necessary amount has been collected
    if (
      collector.amount === 1 ||
      collector.amount === collector.messages.length + 1
    ) {
      // Remove the collector
      botCache.messageCollectors.delete(message.author.id);
      // Resolve the collector
      return collector.resolve([...collector.messages, message]);
    }

    // More messages still need to be collected
    collector.messages.push(message);
  },
});
