import { botCache, memberIDHasPermission } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
botCache.permissionLevels.set(
  PermissionLevels.ADMIN,
  // deno-lint-ignore require-await
  async (message) =>
    memberIDHasPermission(
      message.author.id,
      message.guildID,
      ["ADMINISTRATOR"],
    ),
);
