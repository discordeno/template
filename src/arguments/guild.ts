import { botCache, cache } from "../../deps.ts";

botCache.arguments.set("guild", {
  name: "guild",
  execute: async function (_argument, parameters) {
    const [id] = parameters;
    if (!id) return;

    return cache.guilds.get(id);
  },
});
