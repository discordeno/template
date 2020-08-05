import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/message.ts";
import { Command } from "../types/commands.ts";
import { botCache } from "../../mod.ts";
import { botID } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/module/client.ts";
import {
  Permission,
  Permissions,
} from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/types/permission.ts";
import { sendResponse } from "../utils/helpers.ts";
import { hasChannelPermission } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/channel.ts";

/** This function can be overriden to handle when a command has a mission permission. */
function missingCommandPermission(
  message: Message,
  command: Command,
  missingPermissions: Permission[],
  type:
    | "framework/core:USER_SERVER_PERM"
    | "framework/core:USER_CHANNEL_PERM"
    | "framework/core:BOT_SERVER_PERM"
    | "framework/core:BOT_CHANNEL_PERM",
) {
  const perms = missingPermissions.join(", ");
  const response = type === "framework/core:BOT_CHANNEL_PERM"
    ? `I am missing the following permissions in this channel: **${perms}**`
    : type === "framework/core:BOT_SERVER_PERM"
    ? `I am missing the following permissions in this server from my roles: **${perms}**`
    : type === "framework/core:USER_CHANNEL_PERM"
    ? `You are missing the following permissions in this channel: **${perms}**`
    : `You are missing the following permissions in this server from your roles: **${perms}**`;

  sendResponse(message, response);
}

botCache.inhibitors.set(
  "permissions",
  async function (message, command, guild) {
    // No permissions are required
    if (
      !command.botChannelPermissions?.length &&
      !command.botServerPermissions?.length &&
      !command.userChannelPermissions?.length &&
      !command.userServerPermissions?.length
    ) {
      return false;
    }

    // If some permissions is required it must be in a guild
    if (!guild) return true;

    // If the bot is not available then we can just cancel out.
    const botMember = guild.members.get(botID);
    if (!botMember) return true;

    // Check if the message author has the necessary channel permissions to run this command
    if (command.userChannelPermissions?.length) {
      const missingPermissions = command.userChannelPermissions.filter((perm) =>
        !hasChannelPermission(
          message.channel,
          message.author.id,
          [Permissions[perm]],
        )
      );
      if (missingPermissions.length) {
        missingCommandPermission(
          message,
          command,
          missingPermissions,
          "framework/core:USER_CHANNEL_PERM",
        );
        return false;
      }
    }

    // Check if the message author has the necessary permissions to run this command
    if (command.userServerPermissions?.length) {
      const missingPermissions = command.userServerPermissions.filter((perm) =>
        !hasChannelPermission(
          message.channel,
          message.author.id,
          [Permissions[perm]],
        )
      );
      if (missingPermissions.length) {
        missingCommandPermission(
          message,
          command,
          missingPermissions,
          "framework/core:USER_CHANNEL_PERM",
        );
        return false;
      }
    }

    // Check if the bot has the necessary channel permissions to run this command in this channel.
    if (command.botChannelPermissions?.length) {
      const missingPermissions = command.botChannelPermissions.filter((perm) =>
        !hasChannelPermission(
          message.channel,
          message.author.id,
          [Permissions[perm]],
        )
      );
      if (missingPermissions.length) {
        missingCommandPermission(
          message,
          command,
          missingPermissions,
          "framework/core:USER_CHANNEL_PERM",
        );
        return false;
      }
    }

    // Check if the bot has the necessary permissions to run this command
    if (command.botServerPermissions?.length) {
      const missingPermissions = command.botServerPermissions.filter((perm) =>
        !hasChannelPermission(
          message.channel,
          message.author.id,
          [Permissions[perm]],
        )
      );
      if (missingPermissions.length) {
        missingCommandPermission(
          message,
          command,
          missingPermissions,
          "framework/core:USER_CHANNEL_PERM",
        );
        return false;
      }
    }

    return false;
  },
);
