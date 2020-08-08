import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";
import { memberIDHasPermission } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/permissions.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
botCache.permissionLevels.set(
  PermissionLevels.ADMIN,
  async (message) =>
    memberIDHasPermission(
      message.author.id,
      message.guildID,
      ["ADMINISTRATOR"],
    ),
);
