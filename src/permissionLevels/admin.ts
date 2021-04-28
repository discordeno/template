import { botCache, hasGuildPermissions } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
botCache.permissionLevels.set(
  PermissionLevels.ADMIN,
  (message) =>
    hasGuildPermissions(
      message.guildId,
      message.author.id,
      ["ADMINISTRATOR"],
    ),
);
