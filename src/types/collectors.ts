import type { Message, MessageReactionUncachedPayload } from "discordeno";

export interface BaseCollectorOptions {
  /** The amount of messages to collect before resolving. Defaults to 1 */
  amount?: number;
  /** The amount of milliseconds this should collect for before expiring. Defaults to 5 minutes. */
  duration?: number;
}

export interface MessageCollectorOptions extends BaseCollectorOptions {
  /** Function that will filter messages to determine whether to collect this message. Defaults to making sure the message is sent by the same member. */
  filter?: (message: Message) => boolean;
  /** The amount of messages to collect before resolving. Defaults to 1 */
  amount?: number;
  /** The amount of milliseconds this should collect for before expiring. Defaults to 5 minutes. */
  duration?: number;
}

export interface ReactionCollectorOptions extends BaseCollectorOptions {
  /** Function that will filter messages to determine whether to collect this message. Defaults to making sure the message is sent by the same member. */
  filter?: (
    userID: string,
    reaction: string,
    message: Message | MessageReactionUncachedPayload,
  ) => boolean;
}

export interface BaseCollectorCreateOptions {
  /** The unique key that will be used to get responses for this. Ideally, meant to be for member id. */
  key: string;
  /** The amount of messages to collect before resolving. */
  amount: number;
  /** The timestamp when this collector was created */
  createdAt: number;
  /** The duration in milliseconds how long this collector should last. */
  duration: number;
}

export interface CollectMessagesOptions extends BaseCollectorCreateOptions {
  /** The channel ID where this is listening to */
  channelID: string;
  /** Function that will filter messages to determine whether to collect this message */
  filter: (message: Message) => boolean;
}

export interface CollectReactionsOptions extends BaseCollectorCreateOptions {
  /** The message ID where this is listening to */
  messageID: string;
  /** Function that will filter messages to determine whether to collect this message */
  filter: (
    userID: string,
    reaction: string,
    message: Message | MessageReactionUncachedPayload,
  ) => boolean;
}

export interface MessageCollector extends CollectMessagesOptions {
  resolve: (value: Message[] | PromiseLike<Message[]>) => void;
  // deno-lint-ignore no-explicit-any
  reject: (reason?: any) => void;
  /** Where the messages are stored if the amount to collect is more than 1. */
  messages: Message[];
}

export interface ReactionCollector extends CollectReactionsOptions {
  resolve: (value: string[] | PromiseLike<string[]>) => void;
  // deno-lint-ignore no-explicit-any
  reject: (reason?: any) => void;
  /** Where the messages are stored if the amount to collect is more than 1. */
  reactions: string[];
}
