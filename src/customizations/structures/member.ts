import type { Guild, MemberCreatePayload } from "../../../deps.ts";

import { cacheHandlers, rawAvatarURL, structures } from "../../../deps.ts";

async function createMember(data: MemberCreatePayload, guildID: string) {
  const {
    id,
    bot,
    username,
    discriminator,
    avatar,
  } = data.user || {};

  return {
    id,
    bot,
    nick: data.nick,
    roles: data.roles,
    joinedAt: Date.parse(data.joined_at),
    tag: `${username}#${discriminator}`,
    avatarURL: rawAvatarURL(id, discriminator, avatar),
    guild: await cacheHandlers.get("guilds", guildID),
    mention: `<@${id}>`,
  };
}

// @ts-ignore
structures.createMember = createMember;

declare module "../../../deps.ts" {
  interface Member {
    id: string;
    bot: boolean;
    tag: string;
    avatarURL: string;
    guild: Guild;
    mention: string;
  }
}
