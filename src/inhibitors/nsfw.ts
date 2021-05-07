import { bot } from "../../cache.ts";

bot.inhibitors.set("nsfw", function (message, command) {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.nsfw) return false;

  // DMs are not considered NSFW channels by Discord so we return true to cancel nsfw commands on dms
  if (!message.guild) return true;

  // Checks if this channel is nsfw on or off
  const isNsfw = message.channel?.nsfw;
  // if it is a nsfw channel return false so the command runs otherwise return true to inhibit the command
  return !isNsfw;
});
