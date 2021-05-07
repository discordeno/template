import { bot } from "../../cache.ts";
const SNOWFLAKE_REGEX = /[0-9]{17,19}/;

bot.arguments.set("...snowflakes", {
  name: "...snowflakes",
  execute: function (_argument, parameters) {
    const cleaned = parameters.map((p) => {
      // If its just a normal id number
      if (!p.startsWith("<")) return p;
      // If its a nickname mention or role mention
      if (p.startsWith("<@!") || p.startsWith("<@&")) {
        return p.substring(3, p.length - 1);
      }
      // If it's a user mention or channel mention
      if (p.startsWith("<@") || p.startsWith("<#")) {
        return p.substring(2, p.length - 1);
      }

      // Unknown
      return p;
    });

    return cleaned.filter((text) => SNOWFLAKE_REGEX.test(text));
  },
});
