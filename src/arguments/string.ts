import { botCache } from "../../deps.ts";

botCache.arguments.set("string", {
  name: "string",
  execute: function (argument, parameters) {
    const [text] = parameters;

    const valid =
      // If the argument required literals and some string was provided by user
      argument.literals?.length && text
        ? argument.literals.includes(text.toLowerCase()) ? text : undefined
        : text;

    if (valid) {
      return argument.lowercase ? valid.toLowerCase() : valid;
    }
  },
});
