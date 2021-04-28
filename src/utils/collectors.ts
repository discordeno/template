import {
  CollectMessagesOptions,
  CollectReactionsOptions,
  MessageCollectorOptions,
  ReactionCollectorOptions,
} from "../types/collectors.ts";
import { botCache, botId, DiscordenoMessage, Emoji } from "../../deps.ts";
import { Milliseconds } from "./constants/time.ts";

export async function needMessage(
  memberId: string,
  channelId: string,
  options?: MessageCollectorOptions,
) {
  const [message] = await collectMessages({
    key: memberId,
    channelId,
    createdAt: Date.now(),
    filter: options?.filter || ((msg) => memberId === msg.author.id),
    amount: options?.amount || 1,
    duration: options?.duration || Milliseconds.MINUTE * 5,
  });

  return message;
}

// deno-lint-ignore require-await
export async function collectMessages(
  options: CollectMessagesOptions,
): Promise<DiscordenoMessage[]> {
  return new Promise((resolve, reject) => {
    botCache.messageCollectors.get(options.key)?.reject(
      "A new collector began before the user responded to the previous one.",
    );

    botCache.messageCollectors.set(options.key, {
      ...options,
      messages: [],
      resolve,
      reject,
    });
  });
}

export async function needReaction(
  memberId: string,
  messageID: string,
  options?: ReactionCollectorOptions,
) {
  const [reaction] = await collectReactions({
    key: memberId,
    messageID,
    createdAt: Date.now(),
    filter: options?.filter || ((userID) => memberId === userID),
    amount: options?.amount || 1,
    duration: options?.duration || Milliseconds.MINUTE * 5,
  });

  return reaction;
}

// deno-lint-ignore require-await
export async function collectReactions(
  options: CollectReactionsOptions,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    botCache.reactionCollectors.get(options.key)?.reject(
      "A new collector began before the user responded to the previous one.",
    );
    botCache.reactionCollectors.set(options.key, {
      ...options,
      reactions: [] as string[],
      resolve,
      reject,
    });
  });
}

export function processReactionCollectors(
  message: DiscordenoMessage | { id: string },
  emoji: Partial<Emoji>,
  userID: string,
) {
  // Ignore bot reactions
  if (userID === botId) return;

  const emojiName = emoji.id || emoji.name;
  if (!emojiName) return;

  const collector = botCache.reactionCollectors.get(userID);
  if (!collector) return;

  // This user has no collectors pending or the message is in a different channel
  if (!collector || (message.id !== collector.messageID)) return;
  // This message is a response to a collector. Now running the filter function.
  if (!collector.filter(userID, emojiName, message)) return;

  // If the necessary amount has been collected
  if (
    collector.amount === 1 ||
    collector.amount === collector.reactions.length + 1
  ) {
    // Remove the collector
    botCache.reactionCollectors.delete(userID);
    // Resolve the collector
    return collector.resolve([...collector.reactions, emojiName]);
  }

  // More reactions still need to be collected
  collector.reactions.push(emojiName);
}
