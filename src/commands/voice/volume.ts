import { PermissionLevels } from "./../../types/commands.ts";
import { bot } from "../../../cache.ts";
import { createCommand, createSubcommand } from "../../utils/helpers.ts";

createCommand({
  name: "volume",
  description: "See the current volume.",
  aliases: ["vol", "v"],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  guildOnly: true,
  execute(message) {
    const player = bot.lavadenoManager.players.get(message.guildId.toString());

    if (!player) return message.reply("No player in this guild.");

    return message.reply(`Current volume is ${player.volume}.`);
  },
});

createSubcommand("volume", {
  name: "set",
  description: "Set the volume of the player.",
  aliases: ["s", "change"],
  permissionLevels: [PermissionLevels.MODERATOR],
  arguments: [{ name: "value", type: "number", minimum: 0, required: true }] as const,
  guildOnly: true,
  execute: (message, args) => {
    const player = bot.lavadenoManager.players.get(message.guildId.toString());
    if (!player) return message.reply("No player in this guild.");

    if (args.value > 1000 || args.value < 1) return message.reply("Please provide valid volume from 1 to 1000.");

    player.setVolume(args.value);

    return message.reply(`Player volume successfully set to ${player.volume}.`);
  },
});
