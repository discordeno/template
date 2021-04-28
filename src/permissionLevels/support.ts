import { bot } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";
import { configs } from "../../configs.ts";

// The member using the command must be one of the bots support team
bot.permissionLevels.set(
  PermissionLevels.BOT_SUPPORT,
  (message) => configs.userIDs.botSupporters.includes(message.author.id),
);
