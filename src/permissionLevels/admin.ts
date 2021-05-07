import { hasGuildPermissions } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";
import { bot } from "../../cache.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
bot.permissionLevels.set(
  PermissionLevels.ADMIN,
  (message) =>
    hasGuildPermissions(message.guildId, message.authorId, ["ADMINISTRATOR"]),
);
