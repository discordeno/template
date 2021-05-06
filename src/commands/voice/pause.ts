import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";
import { checkIfUserInMusicChannel } from "../../utils/voice.ts";

createCommand({
  name: "pause",
  guildOnly: true,
  async execute(message) {
    const player = bot.lavadenoManager.players.get(
      message.guildId.toString(),
    );

    if (!player || !(await checkIfUserInMusicChannel(message, player))) {
      return message.reply(
        `The bot is not playing right now`,
      );
    }

    await player.pause();

    return message.reply(`The music has now been paused.`);
  },
});
