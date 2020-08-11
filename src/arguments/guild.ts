import { botCache } from "../../mod.ts";
import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/cache.ts";

botCache.arguments.set("guild", {
  name: "guild",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    return cache.guilds.get(id);
  },
});
