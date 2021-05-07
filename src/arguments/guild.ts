import { cache, snowflakeToBigint } from "../../deps.ts";
import { bot } from "../../cache.ts";

bot.arguments.set("guild", {
  name: "guild",
  execute: function (_argument, parameters) {
    const [id] = parameters;
    if (!id) return;

    return cache.guilds.get(snowflakeToBigint(id));
  },
});
