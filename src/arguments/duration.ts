import { bot } from "../../cache.ts";
import { stringToMilliseconds } from "../utils/helpers.ts";

bot.arguments.set("duration", {
  name: "duration",
  execute: function (_argument, parameters) {
    const [time] = parameters;
    if (!time) return;

    return stringToMilliseconds(time);
  },
});
