import { PermissionLevels } from "../types/commands.ts";
import { botCache, hasGuildPermissions } from "../../deps.ts";

// The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
botCache.permissionLevels.set(
  PermissionLevels.MODERATOR,
  (message) =>
    hasGuildPermissions(
      message.guildId,
      message.author.id,
      ["MANAGE_GUILD"],
    ),
);
