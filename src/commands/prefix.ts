import { bot } from "../../cache.ts";
import { PermissionLevels } from "../types/commands.ts";
import { createCommand, createSubcommand } from "../utils/helpers.ts";
import { parsePrefix } from "../monitors/commandHandler.ts";
import { Embed } from "../utils/Embed.ts";
import { db } from "../database/database.ts";

// This command will only execute if there was no valid sub command: !prefix
createCommand({
  name: "prefix",
  arguments: [
    {
      name: "subcommmand",
      type: "subcommand",
      required: false,
    },
  ] as const,
  guildOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  execute: (message) => {
    const embed = new Embed()
      .setTitle("Prefix Information")
      .setDescription(`**Current Prefix**: \`${parsePrefix(message.guildId)}\``)
      .setTimestamp();

    message.send({ embed });
  },
});

// Create a subcommand for when users do !prefix set $
createSubcommand("prefix", {
  name: "set",
  arguments: [
    {
      name: "prefix",
      type: "string",
      required: true,
      missing: (message) => {
        message.reply(`Please provide a prefix`);
      },
    },
  ] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: (message, args) => {
    if (args.prefix.length > 3) {
      return message.reply("Prefix input too long");
    }

    const oldPrefix = parsePrefix(message.guildId);
    bot.guildPrefixes.set(message.guildId, args.prefix);
    db.guilds.update(message.guildId.toString(), { prefix: args.prefix });

    const embed = new Embed()
      .setTitle("Success, prefix was changed")
      .setDescription([
        `**Old Prefix**: \`${oldPrefix}\``,
        `**New Prefix**: \`${args.prefix}\``,
      ])
      .setTimestamp();

    return message.send({ embed });
  },
});
