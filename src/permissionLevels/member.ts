import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";

// The default level where any member can use the command
botCache.permissionLevels.set(PermissionLevels.MEMBER, async () => true);
