import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "stop",
  aliases: ["leave"],
  guildOnly: true,
  async execute(message) {
    const player = bot.lavadenoManager.players.get(
      message.guildId.toString(),
    );

    if (!player) {
      return message.reply(`The bot is not in any channel!`);
    }

    await bot.lavadenoManager.destroy(message.guildId.toString());

    return message.reply(`Successfully left the channel!`);
  },
});
