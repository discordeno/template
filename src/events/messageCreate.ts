import {
  bot,
  botHasChannelPermissions,
  botHasGuildPermissions,
  botId,
  DiscordChannelTypes,
  hasChannelPermissions,
  hasGuildPermissions,
} from "../../deps.ts";

// deno-lint-ignore require-await
bot.eventHandlers.messageCreate = async function (message) {
  bot.memberLastActive.set(message.authorId, message.timestamp);

  bot.monitors.forEach(async (monitor) => {
    // The !== false is important because when not provided we default to true
    if (monitor.ignoreBots !== false && message.isBot) return;

    if (
      monitor.ignoreDM !== false &&
      message.channel?.type === DiscordChannelTypes.DM
    ) {
      return;
    }

    if (monitor.ignoreEdits && message.editedTimestamp) return;
    if (monitor.ignoreOthers && message.authorId !== botId) return;

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
        monitor.userChannelPermissions.map((perm) =>
          hasChannelPermissions(message.channelId, message.authorId, [perm])
        ),
      );
      if (results.includes(false)) return;
    }

    // Check if the message author has the necessary permissions to run this monitor
    if (
      monitor.userServerPermissions &&
      !(await hasGuildPermissions(
        message.guildId,
        message.authorId,
        monitor.userServerPermissions,
      ))
    ) {
      return;
    }

    // Check if the bot has the necessary channel permissions to run this monitor in this channel.
    if (
      monitor.botChannelPermissions &&
      !(await botHasChannelPermissions(
        message.channelId,
        monitor.botChannelPermissions,
      ))
    ) {
      return;
    }

    // Check if the bot has the necessary permissions to run this monitor
    if (
      monitor.botServerPermissions &&
      !(await botHasGuildPermissions(
        message.guildId,
        monitor.botServerPermissions,
      ))
    ) {
      return;
    }

    return monitor.execute(message);
  });
};
