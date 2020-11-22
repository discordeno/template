import { botCache } from "../../cache.ts";

const SNOWFLAKE_REGEX = /[0-9]{17,19}/;

botCache.arguments.set("...snowflakes", {
  name: "...snowflakes",
  execute: function (argument, parameters) {
    const cleaned = parameters.map((p) => {
      // If its just a normal id number
      if (!p.startsWith("<")) return p;
      // If its a role mention
      if (p.startsWith("<@&")) return p.substring(3, p.length - 1);
      // If it's a channel mention
      if (p.startsWith("<#")) return p.substring(2, p.length - 1);
      // If its a nickname mention
      if (p.startsWith("<@!")) return p.substring(3, p.length - 1);
      // If it's a user mention
      if (p.startsWith("<@")) return p.substring(2, p.length - 1);

      // Unknown
      return p;
    });

    return cleaned.filter((text) => SNOWFLAKE_REGEX.test(text));
  },
});
