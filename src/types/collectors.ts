import { DiscordenoMember, DiscordenoMessage } from "../../deps.ts";

export interface BaseCollectorOptions {
  /** The amount of messages to collect before resolving. Defaults to 1 */
  amount?: number;
  /** The amount of milliseconds this should collect for before expiring. Defaults to 5 minutes. */
  duration?: number;
}

export interface MessageCollectorOptions extends BaseCollectorOptions {
  /** Function that will filter messages to determine whether to collect this message. Defaults to making sure the message is sent by the same member. */
  filter?: (message: DiscordenoMessage) => boolean;
  /** The amount of messages to collect before resolving. Defaults to 1 */
  amount?: number;
  /** The amount of milliseconds this should collect for before expiring. Defaults to 5 minutes. */
  duration?: number;
}

export interface ReactionCollectorOptions extends BaseCollectorOptions {
  /** Function that will filter messages to determine whether to collect this message. Defaults to making sure the message is sent by the same member. */
  filter?: (
    userID: bigint,
    reaction: string,
    message: DiscordenoMessage | { id: string },
  ) => boolean;
}

export interface BaseCollectorCreateOptions {
  /** The unique key that will be used to get responses for this. Ideally, meant to be for member id. */
  key: bigint;
  /** The amount of messages to collect before resolving. */
  amount: number;
  /** The timestamp when this collector was created */
  createdAt: number;
  /** The duration in milliseconds how long this collector should last. */
  duration: number;
}

export interface CollectMessagesOptions extends BaseCollectorCreateOptions {
  /** The channel ID where this is listening to */
  channelId: bigint;
  /** Function that will filter messages to determine whether to collect this message */
  filter: (message: DiscordenoMessage) => boolean;
}

export interface CollectReactionsOptions extends BaseCollectorCreateOptions {
  /** The message ID where this is listening to */
  messageID: bigint;
  /** Function that will filter messages to determine whether to collect this message */
  filter: (
    userID: bigint,
    reaction: string,
    message: DiscordenoMessage | { id: string },
  ) => boolean;
}

export interface MessageCollector extends CollectMessagesOptions {
  resolve: (
    value: DiscordenoMessage[] | PromiseLike<DiscordenoMessage[]>,
  ) => void;
  // deno-lint-ignore no-explicit-any
  reject: (reason?: any) => void;
  /** Where the messages are stored if the amount to collect is more than 1. */
  messages: DiscordenoMessage[];
}

export interface ReactionCollector extends CollectReactionsOptions {
  resolve: (value: string[] | PromiseLike<string[]>) => void;
  // deno-lint-ignore no-explicit-any
  reject: (reason?: any) => void;
  /** Where the reactions are stored if the amount to collect is more than 1. */
  reactions: string[];
}

export interface CollectButtonOptions extends BaseCollectorCreateOptions {
  /** The message ID where this is listening to */
  messageID: bigint;
  /** Function that will filter messages to determine whether to collect this message */
  filter: (
    message: DiscordenoMessage,
    member?: DiscordenoMember,
  ) => boolean;
}

export interface ButtonCollector extends CollectButtonOptions {
  resolve: (value: string[] | PromiseLike<string[]>) => void;
  // deno-lint-ignore no-explicit-any
  reject: (reason?: any) => void;
  /** Where the buttons are stored if the amount to collect is more than 1. */
  buttons: string[];
}

export interface ButtonCollectorOptions extends BaseCollectorOptions {
  /** Function that will filter messages to determine whether to collect this message. Defaults to making sure the message is sent by the same member. */
  filter?: (
    message: DiscordenoMessage,
    member?: DiscordenoMember,
  ) => boolean;
}
