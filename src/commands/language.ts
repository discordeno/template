import { botCache } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";
import { createSubcommand, createCommand, getCurrentLanguage } from "../utils/helpers.ts";
import { Embed } from "../utils/Embed.ts";
import { db } from "../database/database.ts";
import { configs } from "../../configs.ts";

createCommand({
  name: "language",
  aliases: ['lang'],
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      required: false,
    },
  ],
  guildOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  execute: async function (message) {
    const embed = new Embed()
      .setTitle("Language Information")
      .setDescription(`**Current Language**: \`${getCurrentLanguage(message.guildID)}\``)
      .setTimestamp();

    await message.send({ embed }).catch(console.log);
  },
});

createSubcommand("language", {
  name: "set",
  arguments: [
    {
      name: "language",
      type: "string",
      required: true,
      missing: async function(message) {
        message.reply(`Please provide a language`);
      },
    },
  ],
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async function (message, args) {
    const oldLanguage = getCurrentLanguage(message.guildID);
    botCache.guildLanguages.set(message.guildID, args.language);
    await db.guilds.update(message.guildID, { language: args.language });

    const embed = new Embed()
      .setTitle("Success, language was changed")
      .setDescription([`**Old Language**: \`${oldLanguage}\``, `**New Language**: \`${args.language}\``])
      .setTimestamp();

    await message.send({ embed }).catch(console.log);
  },
});