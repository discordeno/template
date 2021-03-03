import { PermissionLevels } from "../types/commands.ts";
import { botCache } from "../../cache.ts";
import { memberIDHasPermission } from "discordeno";

// The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
botCache.permissionLevels.set(
  PermissionLevels.MODERATOR,
  // deno-lint-ignore require-await
  async (message) =>
    memberIDHasPermission(
      message.author.id,
      message.guildID,
      ["MANAGE_GUILD"],
    ),
);
