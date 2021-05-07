import { bot } from "../../cache.ts";

const SNOWFLAKE_REGEX = /[0-9]{17,19}/;

bot.arguments.set("snowflake", {
  name: "snowflake",
  execute: function (_argument, parameters) {
    let [text] = parameters;
    if (!text) return;
    // If its a nickname mention or role mention
    if (text.startsWith("<@!") || text.startsWith("<@&")) {
      text = text.substring(3, text.length - 1);
    }
    // If it's a user mention or channel mention
    if (text.startsWith("<@") || text.startsWith("<#")) {
      text = text.substring(2, text.length - 1);
    }

    if (text.length < 17 || text.length > 19) return;

    return SNOWFLAKE_REGEX.test(text) ? text : undefined;
  },
});
