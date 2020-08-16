import {
  botID,
  Message,
  MessageReactionUncachedPayload,
  ReactionPayload,
} from "../../deps.ts";
import { botCache } from "../../mod.ts";
import {
  MessageCollectorOptions,
  ReactionCollectorOptions,
  CollectMessagesOptions,
  CollectReactionsOptions,
} from "../types/collectors.ts";
import { Milliseconds } from "./constants/time.ts";

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
  console.log("im here", userID, emoji);
  // Ignore bot reactions
  if (userID === botID) return;

  const emojiName = emoji.id || emoji.name;
  if (!emojiName) return;

  const collector = botCache.reactionCollectors.get(userID);
  if (!collector) return;

  console.log("here 2", message, collector);
  // This user has no collectors pending or the message is in a different channel
  if (!collector || (message.id !== collector.messageID)) return;
  console.log("here 3");
  // This message is a response to a collector. Now running the filter function.
  if (!collector.filter(userID, emojiName, message)) return;
  console.log("here 4");
  // If the necessary amount has been collected
  if (
    collector.amount === 1 ||
    collector.amount === collector.reactions.length + 1
  ) {
    console.log("here 5");
    // Remove the collector
    botCache.reactionCollectors.delete(userID);
    // Resolve the collector
    return collector.resolve([...collector.reactions, emojiName]);
  }

  console.log("here 6");
  // More reactions still need to be collected
  collector.reactions.push(emojiName);
}
