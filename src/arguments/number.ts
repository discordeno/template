import { bot } from "../../deps.ts";

bot.arguments.set("number", {
  name: "number",
  execute: function (_argument, parameters) {
    const [number] = parameters;

    const valid = Number(number);
    if (valid) return valid;
  },
});
