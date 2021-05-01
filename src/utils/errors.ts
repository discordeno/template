import { DiscordenoMessage, Errors } from "../../deps.ts";

function missingPermResponse(permission: string) {
  const perm = permission.split("_").slice(1).join(" ");
  return `The bot does not have the necessary permission to ${perm.toLowerCase()}. Grant the **${perm.toUpperCase()}** permission to the bot and try again.`;
}

export async function handleError(message: DiscordenoMessage, type: Errors) {
  switch (type) {
    case Errors.MISSING_SEND_MESSAGES:
      return await message.send(missingPermResponse(type)).catch(console.log);
    case Errors.MISSING_MANAGE_ROLES:
    case Errors.MISSING_KICK_MEMBERS:
    case Errors.MISSING_VIEW_CHANNEL:
    case Errors.MISSING_READ_MESSAGE_HISTORY:
    case Errors.MISSING_MANAGE_NICKNAMES:
    case Errors.MISSING_MUTE_MEMBERS:
    case Errors.MISSING_DEAFEN_MEMBERS:
    case Errors.MISSING_SEND_TTS_MESSAGES:
    case Errors.MISSING_MANAGE_MESSAGES:
    case Errors.MISSING_MANAGE_CHANNELS:
    case Errors.MISSING_CREATE_INSTANT_INVITE:
    case Errors.MISSING_MANAGE_WEBHOOKS:
    case Errors.MISSING_MANAGE_EMOJIS:
    case Errors.MISSING_BAN_MEMBERS:
    case Errors.MISSING_MANAGE_GUILD:
    case Errors.MISSING_VIEW_AUDIT_LOG:
      return await message.send(missingPermResponse(type)).catch(console.log);
    case Errors.DELETE_MESSAGES_MIN:
      return await message.send(
        "You need to provide atleast 2 messages to delete multiple messages at once.",
      ).catch(console.log);
    case Errors.MESSAGE_MAX_LENGTH:
      return await message.send(
        "The amount of characters in this message was too large for me to send. Please contact my developers to have this fixed.",
      ).catch(console.log);
    case Errors.NICKNAMES_MAX_LENGTH:
      return await message.send(
        "A nickname can not be longer than 32 characters.",
      ).catch(console.log);
    case Errors.PRUNE_MIN_DAYS:
      return await message.send(
        "You can not prune members from the server with less than 1 days activity requirement.",
      ).catch(console.log);
    case Errors.RATE_LIMIT_RETRY_MAXED:
      return await message.send(
        "Errored more than the maximum amount of retries. Please contact my developers to have this fixed.",
      ).catch(console.log);
    case Errors.MISSING_INTENT_GUILD_MEMBERS:
      return await message.send(
        "Unable to fetch members if the bot does not have the GUILD MEMBERS intent.",
      ).catch(console.log);
    case Errors.BOTS_HIGHEST_ROLE_TOO_LOW:
      return await message.send(
        "The bot's highest role is too low to complete this action.",
      ).catch(console.log);
    case Errors.CHANNEL_NOT_IN_GUILD:
      return await message.send(
        "This function is only able to be done inside a server. This channel was not found in any server.",
      ).catch(console.log);
    default:
      return;
  }
}
