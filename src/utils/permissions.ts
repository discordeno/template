import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";
import { memberIDHasPermission } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/permissions.ts";
import { configs } from "../../configs.ts";
export function loadDefaultPermissionLevels() {
  // The default level where any member can use the command
  botCache.permissionLevels.set(PermissionLevels.MEMBER, async () => true);

  // The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
  botCache.permissionLevels.set(
    PermissionLevels.MODERATOR,
    async (message) =>
      memberIDHasPermission(
        message.author.id,
        message.guildID,
        ["MANAGE_GUILD"],
      ),
  );

  // The member using the command must be an admin. (Required ADMIN server perm.)
  botCache.permissionLevels.set(
    PermissionLevels.ADMIN,
    async (message) =>
      memberIDHasPermission(
        message.author.id,
        message.guildID,
        ["ADMINISTRATOR"],
      ),
  );

  // The member using the command must be the server owner.
  botCache.permissionLevels.set(
    PermissionLevels.SERVER_OWNER,
    async (message) => message.guild()?.ownerID === message.author.id,
	);

	// The member using the command must be one of the bots support team
	botCache.permissionLevels.set(PermissionLevels.BOT_SUPPORT, async (message) => configs.userIDS.botSupporters.includes(message.author.id))

	// The member using the command must be one of the bots dev team
	botCache.permissionLevels.set(PermissionLevels.BOT_DEVS, async (message) => configs.userIDS.botDevs.includes(message.author.id))

	// The member using the command must be one of the bots dev team
	botCache.permissionLevels.set(PermissionLevels.BOT_DEVS, async (message) => configs.userIDS.botOwners.includes(message.author.id))
}
