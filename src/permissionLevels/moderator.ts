import { PermissionLevels } from "../types/commands.ts";
import { hasGuildPermissions } from "../../deps.ts";
import { bot } from "../../cache.ts";

// The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
bot.permissionLevels.set(
  PermissionLevels.MODERATOR,
  (message) =>
    hasGuildPermissions(message.guildId, message.authorId, ["MANAGE_GUILD"]),
);
