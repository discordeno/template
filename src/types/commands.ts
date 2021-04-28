import {
  ApplicationCommandOption,
  Collection,
  DiscordenoMember,
  DiscordenoMessage,
  Interaction,
  PermissionStrings,
} from "../../deps.ts";

export interface Command {
  name: string;
  aliases?: string[];
  dmOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  permissionLevels?:
    | PermissionLevels[]
    | ((
      message: DiscordenoMessage,
      command: Command,
    ) => boolean | Promise<boolean>);
  botServerPermissions?: PermissionStrings[];
  botChannelPermissions?: PermissionStrings[];
  userServerPermissions?: PermissionStrings[];
  userChannelPermissions?: PermissionStrings[];
  description?: string;
  cooldown?: {
    seconds: number;
    allowedUses?: number;
  };
  arguments?: CommandArgument[];
  subcommands?: Collection<string, Command>;
  slash?: DiscordenoSlashCommand;
  // deno-lint-ignore no-explicit-any
  execute?: (message: DiscordenoMessage, args: any) => unknown;
}

export interface DiscordenoSlashCommand {
  /** Whether or not this slash command should be enabled right now. Defaults to true. */
  enabled?: boolean;
  /** Whether this slash command should be created per guild. Defaults to true. */
  guild?: boolean;
  /** Whether this slash command should be created once globally and allowed in DMs. Defaults to false. */
  global?: boolean;
  /** Whether or not to use the Advanced mode. Defaults to true. */
  advanced?: boolean;
  /** The slash command options for this command. */
  options?: ApplicationCommandOption[];
  execute: (
    data: Omit<Interaction, "member">,
    member?: DiscordenoMember,
  ) => unknown;
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
    | "member"
    | "role"
    | "categorychannel"
    | "newschanne"
    | "textchannel"
    | "voicechannel"
    | "command"
    | "duration"
    | "snowflake"
    | "...snowflakes"
    | "guild";
  /** The function that runs if this argument is required and is missing. */
  missing?: (message: DiscordenoMessage) => unknown;
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
    message: DiscordenoMessage,
    command: Command,
  ) => unknown;
}

export interface Args {
  [key: string]: unknown;
}

export enum PermissionLevels {
  MEMBER,
  MODERATOR,
  ADMIN,
  SERVER_OWNER,
  BOT_SUPPORT,
  BOT_DEVS,
  BOT_OWNER,
}
