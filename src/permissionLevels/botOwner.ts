import { bot } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";
import { configs } from "../../configs.ts";

// The member using the command must be one of the bots dev team
bot.permissionLevels.set(
  PermissionLevels.BOT_OWNER,
  (message) => configs.userIDs.botOwners.includes(message.author.id),
);
