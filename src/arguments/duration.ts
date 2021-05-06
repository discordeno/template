import { bot } from "../../deps.ts";
import { stringToMilliseconds } from "../utils/helpers.ts";

bot.arguments.set("duration", {
  name: "duration",
  execute: async function (_argument, parameters) {
    const [time] = parameters;
    if (!time) return;

    return stringToMilliseconds(time);
  },
});
