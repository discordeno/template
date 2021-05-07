import { configs } from "../../configs.ts";
import { bot } from "../../cache.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be one of the bots dev team
bot.permissionLevels.set(
  PermissionLevels.BOT_DEVS,
  (message) => configs.userIds.botDevs.includes(message.authorId.toString()),
);
