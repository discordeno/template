import { bot } from "../../deps.ts";

bot.arguments.set("...strings", {
  name: "...strings",
  execute: async function (argument, parameters) {
    if (!parameters.length) return;

    return argument.lowercase
      ? parameters.join(" ").toLowerCase()
      : parameters.join(" ");
  },
});
