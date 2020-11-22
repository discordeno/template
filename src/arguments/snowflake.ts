import { botCache } from "../../cache.ts";

const SNOWFLAKE_REGEX = /[0-9]{17,19}/;

botCache.arguments.set("snowflake", {
  name: "snowflake",
  execute: function (argument, parameters) {
    const [text] = parameters;
    if (!text) return;
    if (text.length < 17 || text.length > 19) return;

    return SNOWFLAKE_REGEX.test(text) ? text : undefined;
  },
});
