import { structures } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v9/src/structures/mod.ts";
import { Collection } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v9/src/utils/collection.ts";
import type { MessageCreateOptions } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v9/src/types/message.ts";
import type { Member } from "../../../deps.ts";

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

  const mentions = new Collection<string, Member>();
  for (const mention of data.mentions) {
    mentions.set(
      mention.id,
      await structures.createMember(mention.member, guildID || ""),
    );
  }

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
    mentions,
  };

  return message;
}

// @ts-ignore
structures.createMessage = createMessage;

declare module "../../deps.ts" {
  interface Message {
    mentions: Collection<string, Member>;
  }
}
