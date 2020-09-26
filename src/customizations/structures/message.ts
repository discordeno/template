import type { MessageCreateOptions } from "../../../deps.ts";

import { cache, structures } from "../../../deps.ts";

async function createMessage(data: MessageCreateOptions) {
  const {
    guild_id: guildID,
    channel_id: channelID,
    mentions_everyone: mentionsEveryone,
    mention_channels: mentionChannels,
    mention_roles: mentionRoles,
    webhook_id: webhookID,
    message_reference: messageReference,
    edited_timestamp: editedTimestamp,
    ...rest
  } = data;

  const message = {
    ...rest,
    channelID,
    guildID: guildID || "",
    mentionsEveryone,
    mentionRoles,
    mentionChannels: mentionChannels || [],
    webhookID,
    messageReference,
    timestamp: Date.parse(data.timestamp),
    editedTimestamp: editedTimestamp ? Date.parse(editedTimestamp) : undefined,
    member: cache.guilds.get(guildID || "")?.members.get(data.author.id),
  };

  return message;
}

// @ts-ignore
structures.createMessage = createMessage;

declare module "../../../deps.ts" {
  interface Message {
    member?: Member;
  }
}
