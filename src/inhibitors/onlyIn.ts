import { botCache } from "../../mod.ts";

botCache.inhibitors.set("onlyIn", async function (_message, command, guild) {
  // If the command is guildOnly and does not have a guild, inhibit the command
  if (command.guildOnly && !guild) return true;
  // If the command is dmOnly and there is a guild, inhibit the command
  if (command.dmOnly && guild) return true;

  // The command should be allowed to run because it meets the requirements
  return false;
});
