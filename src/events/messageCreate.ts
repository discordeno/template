import { botCache } from "../../mod.ts";
import { botID } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/module/client.ts";
import { ChannelTypes } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/types/channel.ts";
import { hasChannelPermission } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/channel.ts";
import { Permissions } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/types/permission.ts";
import {
  memberHasPermission,
  botHasPermission,
} from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/permissions.ts";

botCache.eventHandlers.messageCreate = function (message) {
  botCache.monitors.forEach((monitor) => {
    // The !== false is important because when not provided we default to true
    if (monitor.ignoreBots !== false && message.author.bot) return;
    if (
      monitor.ignoreDM !== false && message.channel.type === ChannelTypes.DM
    ) {
      return;
    }

    if (monitor.ignoreEdits && message.editedTimestamp) return;
    if (monitor.ignoreOthers && message.author.id !== botID) return;

    // Permission checks

    // No permissions are required
    if (
      !monitor.botChannelPermissions?.length &&
      !monitor.botServerPermissions?.length &&
      !monitor.userChannelPermissions?.length &&
      !monitor.userServerPermissions?.length
    ) {
      return monitor.execute(message);
    }

    const guild = message.guild();
    // If some permissions is required it must be in a guild
    if (!guild) return;

    // Check if the message author has the necessary channel permissions to run this monitor
    if (
      monitor.userChannelPermissions &&
      monitor.userChannelPermissions.some((perm) =>
        !hasChannelPermission(
          message.channel,
          message.author.id,
          [Permissions[perm]],
        )
      )
    ) {
      return;
    }

    // Check if the message author has the necessary permissions to run this monitor
    if (
      monitor.userServerPermissions &&
      !memberHasPermission(
        message.author.id,
        guild,
        message.member()?.roles || [],
        monitor.userServerPermissions,
      )
    ) {
      return;
    }

    // Check if the bot has the necessary channel permissions to run this monitor in this channel.
    if (
      monitor.botChannelPermissions &&
      monitor.botChannelPermissions.some((perm) =>
        !hasChannelPermission(
          message.channel,
          message.author.id,
          [Permissions[perm]],
        )
      )
    ) {
      return;
    }

    // Check if the bot has the necessary permissions to run this monitor
    if (
      monitor.botServerPermissions &&
      monitor.botServerPermissions.some((perm) =>
        !botHasPermission(
          guild.id,
          [Permissions[perm]],
        )
      )
    ) {
      return;
    }

    return monitor.execute(message);
  });
};
