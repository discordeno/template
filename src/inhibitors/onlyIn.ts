import { bot } from "../../cache.ts";

bot.inhibitors.set("onlyIn", function (message, command) {
  // If the command is guildOnly and does not have a guild, inhibit the command
  if (command.guildOnly && !message.guildId) return true;
  // If the command is dmOnly and there is a guild, inhibit the command
  if (command.dmOnly && message.guildId) return true;

  // The command should be allowed to run because it meets the requirements
  return false;
});
