import { bot } from "../../deps.ts";

bot.arguments.set("boolean", {
  name: "boolean",
  execute: async function (_argument, parameters) {
    const [boolean] = parameters;

    if (
      [
        "true",
        "false",
        "on",
        "off",
        "enable",
        "disable",
      ].includes(boolean)
    ) {
      return [
        "true",
        "on",
        "enable",
      ].includes(boolean);
    }
  },
});
