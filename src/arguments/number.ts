import { bot } from "../../cache.ts";

bot.arguments.set("number", {
  name: "number",
  execute: function (argument, parameters) {
    const [number] = parameters;

    const valid = Number(number);
    if (!valid) return;

    if (valid < (argument.minimum || 0)) return;
    if (argument.maximum && valid > argument.maximum) return;
    if (!argument.allowDecimals) return Math.floor(valid);

    if (valid) return valid;
  },
});
