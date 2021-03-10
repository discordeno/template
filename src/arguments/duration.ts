import { botCache } from "../../deps.ts";
import { stringToMilliseconds } from "../utils/helpers.ts";

botCache.arguments.set("duration", {
  name: "duration",
  // deno-lint-ignore require-await
  execute: async function (_argument, parameters) {
    const [time] = parameters;
    if (!time) return;

    return stringToMilliseconds(time);
  },
});
