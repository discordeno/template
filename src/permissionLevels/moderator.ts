import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";
import { memberIDHasPermission } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/permissions.ts";

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
