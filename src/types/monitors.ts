import type { Permission, Message } from "../../deps.ts";

export interface Monitor {
  /** The name of the monitor */
  name: string;
  /** Whether this monitor should ignore messages that are sent by bots. By default this is true. */
  ignoreBots?: boolean;
  /** Whether this monitor should ignore messages that are sent by others. By default this is false.*/
  ignoreOthers?: boolean;
  /** Whether this monitor should ignore messages that are edited. By default this is false.*/
  ignoreEdits?: boolean;
  /** Whether this monitor should ignore messages that are sent in DM. By default this is true. */
  ignoreDM?: boolean;
  /** The permissions you want to check if the message author has from their roles. */
  userServerPermissions?: Permission[];
  /** The permissions you want to check if the message author has in this channel where the command is used. */
  userChannelPermissions?: Permission[];
  /** The permissions the BOT must have from it's roles. */
  botServerPermissions?: Permission[];
  /** The permissions the BOT must have in the current channel. */
  botChannelPermissions?: Permission[];
  /** The main code that will be run when this monitor is triggered. */
  execute: (message: Message) => unknown;
}
