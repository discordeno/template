import { cache, snowflakeToBigint } from "../../deps.ts";
import { bot } from "../../cache.ts";
import { fetchMember } from "../utils/helpers.ts";
import { log } from "../utils/logger.ts";

bot.arguments.set("member", {
  name: "member",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = cache.guilds.get(message.guildId);
    if (!guild) return;

    const userId = id.startsWith("<@") ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1) : id;

    if (/^[\d+]{17,}$/.test(userId)) {
      const cachedMember = cache.members.get(snowflakeToBigint(userId));
      if (cachedMember?.guilds.has(message.guildId)) return cachedMember;
    }

    const cached = cache.members.find(
      (member) => member.guilds.has(message.guildId) && member.tag.toLowerCase().startsWith(userId.toLowerCase())
    );
    if (cached) return cached;

    if (!/^[\d+]{17,}$/.test(userId)) return;

    log.debug("Fetching a member with Id from gateway", userId);

    const member = await fetchMember(guild.id, userId);

    return member;
  },
});
