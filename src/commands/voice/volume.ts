import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "volume",
  description: "Sets or shows the current volume.",
  aliases: ["vol"],
  arguments: [
      { name: "volume", type: "number", minimum: -Infinity, required: false }
  ],
  guildOnly: true,
  execute(message, args) {
    const player = bot.lavadenoManager.players.get(message.guildId.toString());

    if (!player) return message.reply("No player in this guild.");

    if (!args.volume) return message.reply(`Current volume is ${player?.volume}`);

    if (args.volume > 100 || args.volume < 1) return message.reply("Please select volume from 100 to 1");
    
    player.setVolume(args.volume)

    return message.reply(`The volume has been set to ${player?.volume}`);
  },
});
