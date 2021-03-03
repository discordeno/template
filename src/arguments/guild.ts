import { botCache } from "../../cache.ts";
import { cache } from "discordeno";

botCache.arguments.set("guild", {
  name: "guild",
  // deno-lint-ignore require-await
  execute: async function (_argument, parameters) {
    const [id] = parameters;
    if (!id) return;

    return cache.guilds.get(id);
  },
});
