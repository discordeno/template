import { bot } from "../../cache.ts";
import { PermissionLevels } from "../types/commands.ts";

// The default level where any member can use the command
bot.permissionLevels.set(PermissionLevels.MEMBER, () => true);
