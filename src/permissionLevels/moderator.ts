import { PermissionLevels } from "../types/commands.ts";
import { botCache, memberIDHasPermission } from "../../deps.ts";

// The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
botCache.permissionLevels.set(
  PermissionLevels.MODERATOR,
  async (message) =>
    memberIDHasPermission(
      message.author.id,
      message.guildID,
      ["MANAGE_GUILD"],
    ),
);
