import { bot } from "../../cache.ts";
import {
  botId,
  DiscordenoMember,
  DiscordenoMessage,
  Emoji,
  Interaction,
  snowflakeToBigint,
  structures,
} from "../../deps.ts";
import {
  ButtonCollectorOptions,
  ButtonCollectorReturn,
  CollectButtonOptions,
  CollectMessagesOptions,
  CollectReactionsOptions,
  MessageCollectorOptions,
  ReactionCollectorOptions,
} from "../types/collectors.ts";
import { Milliseconds } from "./constants/time.ts";

export async function needMessage(
  memberId: bigint,
  channelId: bigint,
  options: MessageCollectorOptions & { amount?: 1 },
): Promise<DiscordenoMessage>;
export async function needMessage(
  memberId: bigint,
  channelId: bigint,
  options: MessageCollectorOptions & { amount?: number },
): Promise<DiscordenoMessage[]>;
export async function needMessage(
  memberId: bigint,
  channelId: bigint,
): Promise<DiscordenoMessage>;
export async function needMessage(
  memberId: bigint,
  channelId: bigint,
  options?: MessageCollectorOptions,
) {
  const messages = await collectMessages({
    key: memberId,
    channelId,
    createdAt: Date.now(),
    filter: options?.filter || ((msg) => memberId === msg.authorId),
    amount: options?.amount || 1,
    duration: options?.duration || Milliseconds.MINUTE * 5,
  });

  return (options?.amount || 1) > 1 ? messages : messages[0];
}

export function collectMessages(
  options: CollectMessagesOptions,
): Promise<DiscordenoMessage[]> {
  return new Promise((resolve, reject) => {
    bot.messageCollectors
      .get(options.key)
      ?.reject(
        "A new collector began before the user responded to the previous one.",
      );

    bot.messageCollectors.set(options.key, {
      ...options,
      messages: [],
      resolve,
      reject,
    });
  });
}

export async function needReaction(
  memberId: bigint,
  messageId: bigint,
  options: ReactionCollectorOptions & { amount?: 1 },
): Promise<string>;
export async function needReaction(
  memberId: bigint,
  messageId: bigint,
  options: ReactionCollectorOptions & { amount?: number },
): Promise<string[]>;
export async function needReaction(
  memberId: bigint,
  messageId: bigint,
): Promise<string>;
export async function needReaction(
  memberId: bigint,
  messageId: bigint,
  options?: ReactionCollectorOptions,
) {
  const reactions = await collectReactions({
    key: memberId,
    messageId,
    createdAt: Date.now(),
    filter: options?.filter || ((userId) => memberId === userId),
    amount: options?.amount || 1,
    duration: options?.duration || Milliseconds.MINUTE * 5,
  });

  return (options?.amount || 1) > 1 ? reactions : reactions[0];
}

export function collectReactions(
  options: CollectReactionsOptions,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    bot.reactionCollectors
      .get(options.key)
      ?.reject(
        "A new collector began before the user responded to the previous one.",
      );
    bot.reactionCollectors.set(options.key, {
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
  userId: bigint,
) {
  // Ignore bot reactions
  if (userId === botId) return;

  const emojiName = emoji.id || emoji.name;
  if (!emojiName) return;

  const collector = bot.reactionCollectors.get(userId);
  if (!collector) return;

  // This user has no collectors pending or the message is in a different channel
  if (!collector || message.id !== collector.messageId) return;
  // This message is a response to a collector. Now running the filter function.
  if (!collector.filter(userId, emojiName, message)) return;

  // If the necessary amount has been collected
  if (
    collector.amount === 1 ||
    collector.amount === collector.reactions.length + 1
  ) {
    // Remove the collector
    bot.reactionCollectors.delete(userId);
    // Resolve the collector
    return collector.resolve([...collector.reactions, emojiName]);
  }

  // More reactions still need to be collected
  collector.reactions.push(emojiName);
}

// BUTTONS

export async function needButton(
  memberId: bigint,
  messageId: bigint,
  options: ButtonCollectorOptions & { amount?: 1 },
): Promise<ButtonCollectorReturn>;
export async function needButton(
  memberId: bigint,
  messageId: bigint,
  options: ButtonCollectorOptions & { amount?: number },
): Promise<ButtonCollectorReturn[]>;
export async function needButton(
  memberId: bigint,
  messageId: bigint,
): Promise<ButtonCollectorReturn>;
export async function needButton(
  memberId: bigint,
  messageId: bigint,
  options?: ButtonCollectorOptions,
) {
  const buttons = await collectButtons({
    key: memberId,
    messageId,
    createdAt: Date.now(),
    filter: options?.filter ||
      ((_msg, member) => (member ? memberId === member.id : true)),
    amount: options?.amount || 1,
    duration: options?.duration || Milliseconds.MINUTE * 5,
  });

  return (options?.amount || 1) > 1 ? buttons : buttons[0];
}

export function collectButtons(
  options: CollectButtonOptions,
): Promise<ButtonCollectorReturn[]> {
  return new Promise((resolve, reject) => {
    bot.buttonCollectors
      .get(options.key)
      ?.reject(
        "A new collector began before the user responded to the previous one.",
      );
    bot.buttonCollectors.set(options.key, {
      ...options,
      buttons: [] as ButtonCollectorReturn[],
      resolve,
      reject,
    });
  });
}

export async function processButtonCollectors(
  data: Omit<Interaction, "member">,
  member?: DiscordenoMember,
) {
  // All buttons will require a message
  if (!data.message) return;

  // If this message is not pending a button response, we can ignore
  const collector = bot.buttonCollectors.get(
    member ? member.id : snowflakeToBigint(data.message.id),
  );
  if (!collector) return;

  // This message is a response to a collector. Now running the filter function.
  if (
    !collector.filter(
      await structures.createDiscordenoMessage(data.message),
      member,
    )
  ) {
    return;
  }

  // If the necessary amount has been collected
  if (
    collector.amount === 1 ||
    collector.amount === collector.buttons.length + 1
  ) {
    // Remove the collector
    bot.buttonCollectors.delete(snowflakeToBigint(data.message.id));
    // Resolve the collector
    return collector.resolve([
      ...collector.buttons,
      {
        customId: data.data?.customId ||
          `No customId provided for this button.`,
        interaction: data,
        member,
      },
    ]);
  }

  // More buttons still need to be collected
  collector.buttons.push({
    customId: data.data?.customId || `No customId provided for this button.`,
    interaction: data,
    member,
  });
}
