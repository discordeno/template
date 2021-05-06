import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";
import { checkIfUserInMusicChannel } from "../../utils/voice.ts";

createCommand({
  name: "resume",
  guildOnly: true,
  async execute(message) {
    const player = bot.lavadenoManager.players.get(
      message.guildId.toString(),
    );

    if (!player) {
      return message.reply(
        `The bot is not playing right now`,
      );
    }

    if (!(await checkIfUserInMusicChannel(message, player))) {
      return message.reply(
        "You must be in a voice channel in order to execute this command",
      );
    }

    await player.resume();

    return message.reply(`The music has now resumed.`);
  },
});
