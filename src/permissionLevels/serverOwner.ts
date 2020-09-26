import { cache } from "../../deps.ts";
import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an server owner.
botCache.permissionLevels.set(
  PermissionLevels.SERVER_OWNER,
  async (message) => cache.guilds.get(message.guildID)?.ownerID === message.author.id,
);
