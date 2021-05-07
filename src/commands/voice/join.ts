import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "join",
  guildOnly: true,
  execute(message) {
    const player = bot.lavadenoManager.players.get(message.guildId.toString());

    if (player?.connected) {
      return message.reply(
        `The bot is already connected to a channel in this guild!`,
      );
    }

    const voiceState = message.guild?.voiceStates.get(message.authorId);

    if (!voiceState?.channelId) {
      return message.reply(`You first need to join a voice channel!`);
    }

    if (player) {
      player.connect(voiceState.channelId.toString(), {
        selfDeaf: true,
      });
    } else {
      const newPlayer = bot.lavadenoManager.create(message.guildId.toString());
      newPlayer.connect(voiceState.channelId.toString(), {
        selfDeaf: true,
      });
    }

    return message.reply(`Successfully joined the channel!`);
  },
});
