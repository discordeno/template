import { bot } from "../../cache.ts";

bot.arguments.set("...strings", {
  name: "...strings",
  execute: function (argument, parameters) {
    if (!parameters.length) return;

    return argument.lowercase
      ? parameters.join(" ").toLowerCase()
      : parameters.join(" ");
  },
});
