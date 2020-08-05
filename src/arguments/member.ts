import { botCache } from "../../mod.ts";
import { getMember } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/guild.ts";

botCache.arguments.set("member", {
  name: "member",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = message.guild();
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
