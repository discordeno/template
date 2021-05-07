import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "clear",
  guildOnly: true,
  async execute(message) {
    const player = bot.lavadenoManager.players.get(message.guildId.toString());
    const queue = bot.musicQueues.get(message.guildId);

    if (!player || !queue) {
      return message.reply(`The bot is not playing right now`);
    }

    bot.musicQueues.set(message.guildId, []);
    await player.stop();

    return message.reply("The queue is now empty");
  },
});
