import { bot } from "../../deps.ts";
import { translate } from "../utils/i18next.ts";

bot.arguments.set("boolean", {
  name: "boolean",
  execute: async function (_argument, parameters, message) {
    const [boolean] = parameters;

    if (
      [
        "true",
        "false",
        "on",
        "off",
        "enable",
        "disable",
        translate(message.guildId, "strings:TRUE"),
        translate(message.guildId, "strings:FALSE"),
        translate(message.guildId, "strings:ON"),
        translate(message.guildId, "strings:OFF"),
        translate(message.guildId, "strings:ENABLE"),
        translate(message.guildId, "strings:DISABLE"),
      ].includes(boolean)
    ) {
      return [
        "true",
        "on",
        "enable",
        translate(message.guildId, "strings:TRUE"),
        translate(message.guildId, "strings:ON"),
        translate(message.guildId, "strings:ENABLE"),
      ].includes(boolean);
    }
  },
});
