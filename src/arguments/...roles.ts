import { cache, snowflakeToBigint } from "../../deps.ts";
import { bot } from "../../cache.ts";

bot.arguments.set("...roles", {
  name: "...roles",
  execute: function (_argument, parameters, message) {
    if (!parameters.length) return;

    const guild = cache.guilds.get(message.guildId);
    if (!guild) return;

    return parameters.map((word) => {
      const roleId = word.startsWith("<@&")
        ? word.substring(3, word.length - 1)
        : word;

      const name = word.toLowerCase();
      const role = guild.roles.get(snowflakeToBigint(roleId)) ||
        guild.roles.find((r) => r.name.toLowerCase() === name);
      if (role) return role;
    });
  },
});
