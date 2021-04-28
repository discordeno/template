import { botCache } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an server owner.
botCache.permissionLevels.set(
  PermissionLevels.SERVER_OWNER,
  (message) => message.guild?.ownerId === message.author.id,
);
