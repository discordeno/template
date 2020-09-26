import type {
  Message,
  MessageReactionUncachedPayload,
  ReactionPayload,
} from "../../deps.ts";
import type {
  MessageCollectorOptions,
  ReactionCollectorOptions,
  CollectMessagesOptions,
  CollectReactionsOptions,
} from "../types/collectors.ts";

import { botID } from "../../deps.ts";
import { Milliseconds } from "./constants/time.ts";
import { botCache } from "../../mod.ts";

export async function needMessage(
  memberID: string,
  channelID: string,
  options?: MessageCollectorOptions,
) {
  const [message] = await collectMessages({
    key: memberID,
    channelID,
    createdAt: Date.now(),
    filter: options?.filter || ((msg) => memberID === msg.author.id),
    amount: options?.amount || 1,
    duration: options?.duration || Milliseconds.MINUTE * 5,
  });

  return message;
}

export async function collectMessages(
  options: CollectMessagesOptions,
): Promise<Message[]> {
  return new Promise((resolve, reject) => {
    botCache.messageCollectors.set(options.key, {
      ...options,
      messages: [],
      resolve,
      reject,
    });
  });
}

export async function needReaction(
  memberID: string,
  messageID: string,
  options?: ReactionCollectorOptions,
) {
  const [reaction] = await collectReactions({
    key: memberID,
    messageID,
    createdAt: Date.now(),
    filter: options?.filter || ((userID) => memberID === userID),
    amount: options?.amount || 1,
    duration: options?.duration || Milliseconds.MINUTE * 5,
  });

  return reaction;
}

export async function collectReactions(
  options: CollectReactionsOptions,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    botCache.reactionCollectors.set(options.key, {
      ...options,
      reactions: [] as string[],
      resolve,
      reject,
    });
  });
}

export function processReactionCollectors(
  message: Message | MessageReactionUncachedPayload,
  emoji: ReactionPayload,
  userID: string,
) {
  // Ignore bot reactions
  if (userID === botID) return;

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
