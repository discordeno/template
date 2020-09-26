import { Errors, Message, sendMessage } from "../../deps.ts";

function missingPermResponse(permission: string) {
  const perm = permission.split("_").slice(1).join(" ");
  return `The bot does not have the necessary permission to ${perm.toLowerCase()}. Grant the **${perm.toUpperCase()}** permission to the bot and try again.`;
}

export function handleError(message: Message, type: Errors) {
  switch (type) {
    case Errors.MISSING_SEND_MESSAGES:
      return sendMessage(
        message.channelID,
        missingPermResponse(type),
      ).catch(() => undefined);
    case Errors.MISSING_MANAGE_ROLES:
    case Errors.MISSING_KICK_MEMBERS:
    case Errors.MISSING_VIEW_CHANNEL:
    case Errors.MISSING_READ_MESSAGE_HISTORY:
    case Errors.MISSING_MANAGE_NICKNAMES:
    case Errors.MISSING_MUTE_MEMBERS:
    case Errors.MISSING_DEAFEN_MEMBERS:
    case Errors.MISSING_SEND_TTS_MESSAGE:
    case Errors.MISSING_MANAGE_MESSAGES:
    case Errors.MISSING_MANAGE_CHANNELS:
    case Errors.MISSING_CREATE_INSTANT_INVITE:
    case Errors.MISSING_MANAGE_WEBHOOKS:
    case Errors.MISSING_MANAGE_EMOJIS:
    case Errors.MISSING_BAN_MEMBERS:
    case Errors.MISSING_MANAGE_GUILD:
    case Errors.MISSING_VIEW_AUDIT_LOG:
      return sendMessage(
        message.channelID,
        missingPermResponse(type),
      );
    case Errors.DELETE_MESSAGES_MIN:
      return sendMessage(
        message.channelID,
        "You need to provide atleast 2 messages to delete multiple messages at once.",
      );
    case Errors.MESSAGE_MAX_LENGTH:
      return sendMessage(
        message.channelID,
        "The amount of characters in this message was too large for me to send. Please contact my developers to have this fixed.",
      );
    case Errors.NICKNAMES_MAX_LENGTH:
      return sendMessage(
        message.channelID,
        "A nickname can not be longer than 32 characters.",
      );
    case Errors.PRUNE_MIN_DAYS:
      return sendMessage(
        message.channelID,
        "You can not prune members from the server with less than 1 days activity requirement.",
      );
    case Errors.RATE_LIMIT_RETRY_MAXED:
      return sendMessage(
        message.channelID,
        "Errored more than the maximum amount of retries. Please contact my developers to have this fixed.",
      );
    case Errors.MISSING_INTENT_GUILD_MEMBERS:
      return sendMessage(
        message.channelID,
        "Unable to fetch members if the bot does not have the GUILD MEMBERS intent.",
      );
    case Errors.BOTS_HIGHEST_ROLE_TOO_LOW:
      return sendMessage(
        message.channelID,
        "The bot's highest role is too low to complete this action.",
      );
    case Errors.CHANNEL_NOT_IN_GUILD:
      return sendMessage(
        message.channelID,
        "This function is only able to be done inside a server. This channel was not found in any server.",
      );
    default:
      return;
  }
}
