import {
  botCache,
  cache,
  getMember,
} from "../../deps.ts";

botCache.arguments.set("member", {
  name: "member",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    const userID = id.startsWith("<@")
      ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1)
      : id;

    const cachedMember = guild.members.get(userID);
    if (cachedMember) return cachedMember;

    const member = await getMember(guild.id, userID)
      .catch(() => undefined);
    return member;
  },
});
