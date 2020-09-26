import { cache } from "../../deps.ts";
import { botCache } from "../../mod.ts";

botCache.inhibitors.set("nsfw", async function (message, command, guild) {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.nsfw) return false;

  // DMs are not considered NSFW channels by Discord so we return true to cancel nsfw commands on dms
  if (!guild) return true;

  // Checks if this channel is nsfw on or off
  const isNsfw = cache.channels.get(message.channelID)?.nsfw;
  // if it is a nsfw channel return false so the command runs otherwise return true to inhibit the command
  return !isNsfw;
});
