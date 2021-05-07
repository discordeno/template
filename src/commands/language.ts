import { bot } from "../../cache.ts";
import { PermissionLevels } from "../types/commands.ts";
import {
  createCommand,
  createSubcommand,
  getCurrentLanguage,
} from "../utils/helpers.ts";
import { Embed } from "../utils/Embed.ts";
import { db } from "../database/database.ts";

const allowedLanguages = [
  { id: "en_US", flag: ":flag_us:", name: "English" },
  { id: "cs_CZ", flag: ":flag_cz:", name: "Czech" },
];
const listOfLanguages = allowedLanguages
  .map((lang) => `${lang.flag} - \`${lang.name}\``)
  .join("\n");

createCommand({
  name: "language",
  aliases: ["lang"],
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      required: false,
    },
  ] as const,
  guildOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  execute: function (message) {
    const currentLanguageId = getCurrentLanguage(message.guildId);
    const currentLanguage = allowedLanguages.find((item) =>
      item.id === currentLanguageId
    ) ||
      allowedLanguages[0];
    const embed = new Embed()
      .setTitle("Language Information")
      .setDescription(
        `**Current Language**: ${currentLanguage.flag} - \`${currentLanguage.name}\``,
      )
      .setTimestamp();

    message.send({ embed });
  },
});

createSubcommand("language", {
  name: "set",
  arguments: [
    {
      name: "language",
      type: "string",
      required: true,
      missing: function (message) {
        const embed = new Embed()
          .setTitle("Available Languages")
          .setDescription(listOfLanguages);
        message.send({ embed });
      },
    },
  ] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async function (message, args) {
    //Old
    const oldLanguageId = getCurrentLanguage(message.guildId);
    const oldLanguage = allowedLanguages.find((item) =>
      item.id === oldLanguageId
    ) ||
      allowedLanguages[0];

    //New
    const newLanguageName = args.language;
    const newLanguage = allowedLanguages.find(
      (item) => item.name === newLanguageName,
    );

    //Handle
    if (!newLanguage) {
      const embed = new Embed()
        .setTitle("Error")
        .setDescription(
          "Check list of languages by running command `language set`.",
        )
        .addField("Error", `\`${args.language}\` is not a valid language.`);

      message.send({ embed });
    } else {
      bot.guildLanguages.set(message.guildId, newLanguage.id);
      await db.guilds
        .update(message.guildId.toString(), {
          language: newLanguage.id,
        })
        .catch(console.log);

      const embed = new Embed()
        .setTitle("Success")
        .setDescription([
          `**Old Language**: ${oldLanguage.flag} - \`${oldLanguage.name}\``,
          `**New Language**: ${newLanguage.flag} - \`${newLanguage.name}\``,
        ])
        .setTimestamp();

      message.send({ embed });
    }
  },
});
