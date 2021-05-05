import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "join",
  guildOnly: true,
  async execute(message) {
    const player = await bot.lavadenoManager.players.get(
      message.guildId.toString(),
    );

    if (player) {
      return message.reply(
        `The bot is already connected to a channel in this guild!`,
      );
    }

    const voiceState = message.guild?.voiceStates.get(message.authorId);

    if (!voiceState?.channelId) {
      return message.reply(`You first need to join a voice channel!`);
    }

    const newPlayer = bot.lavadenoManager.create(message.guildId.toString());
    await newPlayer.connect(voiceState.channelId.toString(), {
      selfDeaf: true,
    });

    return message.reply(`Successfully joined the channel!`);
  },
});
