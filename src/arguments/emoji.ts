import { cache } from "../../deps.ts";
import { defaultEmojis } from "../utils/constants/default_emojis.ts";
import { emojiUnicode } from "../utils/helpers.ts";
import { bot } from "../../cache.ts";

bot.arguments.set("emoji", {
  name: "emoji",
  execute: function (_argument, parameters, message) {
    let [id] = parameters;
    if (!id) return;

    if (defaultEmojis.has(id)) return id;

    if (id.startsWith("<:") || id.startsWith("<a:")) {
      id = id.substring(id.lastIndexOf(":") + 1, id.length - 1);
    }

    let emoji = cache.guilds
      .get(message.guildId)
      ?.emojis.find((e) => e.id === id);
    if (!emoji) {
      for (const guild of cache.guilds.values()) {
        const globalemoji = guild.emojis.find((e) => e.id === id);
        if (!globalemoji) continue;

        emoji = globalemoji;
        break;
      }

      if (!emoji) return;
    }

    return emojiUnicode(emoji);
  },
});
