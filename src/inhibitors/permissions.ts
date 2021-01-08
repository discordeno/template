import {
  botCache,
  botHasChannelPermissions,
  botHasPermission,
  hasChannelPermissions,
  memberIDHasPermission,
  Message,
  Permission
} from "../../deps.ts";

/** This function can be overriden to handle when a command has a mission permission. */
function missingCommandPermission(
  message: Message,
  missingPermissions: Permission[],
  type:
    | "framework/core:USER_SERVER_PERM"
    | "framework/core:USER_CHANNEL_PERM"
    | "framework/core:BOT_SERVER_PERM"
    | "framework/core:BOT_CHANNEL_PERM"
) {
  const perms = missingPermissions.join(", ");
  const response =
    type === "framework/core:BOT_CHANNEL_PERM"
      ? `I am missing the following permissions in this channel: **${perms}**`
      : type === "framework/core:BOT_SERVER_PERM"
      ? `I am missing the following permissions in this server from my roles: **${perms}**`
      : type === "framework/core:USER_CHANNEL_PERM"
      ? `You are missing the following permissions in this channel: **${perms}**`
      : `You are missing the following permissions in this server from your roles: **${perms}**`;

  if (missingPermissions.find((perm) => perm === "SEND_MESSAGES" || perm === "VIEW_CHANNEL")) return;
  message.reply(response);
}

botCache.inhibitors.set("permissions", async function (message, command) {
  if (!message.guild) return false;

  // No permissions are required
  if (
    !command.botChannelPermissions?.length &&
    !command.botServerPermissions?.length &&
    !command.userChannelPermissions?.length &&
    !command.userServerPermissions?.length
  ) {
    return false;
  }

  // Check if the message author has the necessary channel permissions to run this command
  if (command.userChannelPermissions?.length) {
    const missingPermissions: Permission[] = [];
    for (const perm of command.userChannelPermissions) {
      const hasPerm = await hasChannelPermissions(message.channelID, message.author.id, [perm]);
      if (!hasPerm) missingPermissions.push(perm);
    }

    if (missingPermissions.length) {
      missingCommandPermission(message, missingPermissions, "framework/core:USER_CHANNEL_PERM");
      return true;
    }
  }

  const member = message.guild.members.get(message.author.id);

  // Check if the message author has the necessary permissions to run this command
  if (member && command.userServerPermissions?.length) {
    const missingPermissions: Permission[] = [];
    for (const perm of command.userServerPermissions) {
      const hasPerm = await memberIDHasPermission(message.author.id, message.guildID, [perm]);
      if (!hasPerm) missingPermissions.push(perm);
    }

    if (missingPermissions.length) {
      missingCommandPermission(message, missingPermissions, "framework/core:USER_SERVER_PERM");
      return true;
    }
  }

  // Check if the bot has the necessary channel permissions to run this command in this channel.
  if (command.botChannelPermissions?.length) {
    const missingPermissions: Permission[] = [];
    for (const perm of command.botChannelPermissions) {
      const hasPerm = await botHasChannelPermissions(message.channelID, [perm]);
      if (!hasPerm) missingPermissions.push(perm);
    }

    if (missingPermissions.length) {
      missingCommandPermission(message, missingPermissions, "framework/core:BOT_CHANNEL_PERM");
      return true;
    }
  }

  // Check if the bot has the necessary permissions to run this command
  if (command.botServerPermissions?.length) {
    const missingPermissions: Permission[] = [];
    for (const perm of command.botServerPermissions) {
      const hasPerm = await botHasPermission(message.guildID, [perm]);
      if (!hasPerm) missingPermissions.push(perm);
    }

    if (missingPermissions.length) {
      missingCommandPermission(message, missingPermissions, "framework/core:BOT_CHANNEL_PERM");
      return true;
    }
  }

  return false;
});
