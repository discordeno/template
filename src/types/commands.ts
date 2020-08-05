import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/message.ts";
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/guild.ts";
import { Permission } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/types/permission.ts";

export interface Command {
  name: string;
  dmOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  allowedRoles?: string[];
  botServerPermissions?: Permission[];
  botChannelPermissions?: Permission[];
  userServerPermissions?: Permission[];
  userChannelPermissions?: Permission[];
  description?: string;
  cooldown?: {
    seconds: number;
    allowedUses?: number;
  };
  arguments?: CommandArgument[];
  subcommands?: Map<string, Command>;
  execute: (message: Message, args: any, guild?: Guild) => unknown;
}

export interface CommandArgument {
  /** The name of the argument. Useful for when you need to alert the user X arg is missing. */
  name: string;
  /** The type of the argument you would like. Defaults to string. */
  type?:
    | "number"
    | "string"
    | "...string"
    | "boolean"
    | "subcommand"
    | "member";
  /** The function that runs if this argument is required and is missing. */
  missing?: (message: Message) => unknown;
  /** Whether or not this argument is required. Defaults to true. */
  required?: boolean;
  /** If the type is string, this will force this argument to be lowercase. */
  lowercase?: boolean;
  /** If the type is string or subcommand you can provide literals. The argument MUST be exactly the same as the literals to be accepted. For example, you can list the subcommands here to make sure it matches. */
  literals?: string[];
  /** The default value for this argument/subcommand. */
  defaultValue?: string | boolean | number;
}

export interface Argument {
  name: string;
  execute: (
    arg: CommandArgument,
    parameter: string[],
    message: Message,
  ) => unknown;
}

export interface Args {
  [key: string]: unknown;
}
