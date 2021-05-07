import { configs } from "../../configs.ts";
import { bot } from "../../cache.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be one of the bots support team
bot.permissionLevels.set(
  PermissionLevels.BOT_SUPPORT,
  (message) =>
    configs.userIds.botSupporters.includes(message.authorId.toString()),
);
