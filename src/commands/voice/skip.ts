import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";
import { checkIfUserInMusicChannel } from "../../utils/voice.ts";

createCommand({
  name: "skip",
  aliases: ["next", "s"],
  guildOnly: true,
  async execute(message) {
    const player = bot.lavadenoManager.players.get(
      message.guildId.toString(),
    );
    const queue = bot.musicQueues.get(message.guildId);

    if (!player || !queue) {
      return message.reply(
        `The bot is not playing right now`,
      );
    }

    if (!(await checkIfUserInMusicChannel(message, player))) {
      return message.reply(
        "You must be in a voice channel in order to execute this command",
      );
    }

    await player.stop();

    return message.reply(`${queue[0].info.title} has been skipped!`);
  },
});
