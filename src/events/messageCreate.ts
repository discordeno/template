import {
  botCache,
  botHasPermission,
  botID,
  ChannelTypes,
  hasChannelPermissions,
  botHasChannelPermissions,
  memberIDHasPermission,
} from "../../deps.ts";

botCache.eventHandlers.messageCreate = async function (message) {
  botCache.memberLastActive.set(message.author.id, message.timestamp);

  botCache.monitors.forEach(async (monitor) => {
    // The !== false is important because when not provided we default to true
    if (monitor.ignoreBots !== false && message.author.bot) return;

    if (monitor.ignoreDM !== false && message.channel?.type === ChannelTypes.DM) {
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

    // If some permissions is required it must be in a guild
    if (!message.guild) return;

    // Check if the message author has the necessary channel permissions to run this monitor
    if (monitor.userChannelPermissions) {
      const results = await Promise.all(
        monitor.userChannelPermissions.map((perm) => hasChannelPermissions(message.author.id, message.guildID, [perm]))
      );
      if (results.includes(false)) return;
    }

    // Check if the message author has the necessary permissions to run this monitor
    if (
      monitor.userServerPermissions &&
      !(await memberIDHasPermission(message.author.id, message.guildID, monitor.userServerPermissions))
    )
      return;

    // Check if the bot has the necessary channel permissions to run this monitor in this channel.
    if (monitor.botChannelPermissions && !(await botHasChannelPermissions(message.guildID, monitor.botChannelPermissions))) return;

    // Check if the bot has the necessary permissions to run this monitor
    if (monitor.botServerPermissions && !(await botHasPermission(message.guildID, monitor.botServerPermissions))) return;

    return monitor.execute(message);
  });
};
