import { botCache } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The default level where any member can use the command
// deno-lint-ignore require-await
botCache.permissionLevels.set(PermissionLevels.MEMBER, async () => true);
