import { bot } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an server owner.
bot.permissionLevels.set(
  PermissionLevels.SERVER_OWNER,
  (message) => message.guild?.ownerId === message.author.id,
);
