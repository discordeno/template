import { bot } from "../../../cache.ts";
import { Embed } from "../../utils/Embed.ts";
import { createCommand } from "../../utils/helpers.ts";
import { getMusicLength } from "../../utils/voice.ts";

createCommand({
  name: "playing",
  aliases: ["np", "nowplaying"],
  guildOnly: true,
  execute(message) {
    const player = bot.lavadenoManager.players.get(message.guildId.toString());
    const queue = bot.musicQueues.get(message.guildId);

    if (!player || !queue) {
      return message.reply(`The bot is not currently playing music`);
    }

    const embed = new Embed()
      .setAuthor(`${message.tag}`, message.member?.avatarURL)
      .setTitle(
        player.playing && queue ? `Now Playing - ${queue[0].info.title}` : `Not playing anything`,
        player.playing && queue ? queue[0].info.uri : ""
      )
      .setDescription(
        player.playing && queue
          ? `**Progress:** ${getMusicLength(player.position)}/${getMusicLength(queue[0].info.length)}`
          : `You're not playing any music, add a music using im!play (music)`
      )
      .setTimestamp(player.timestamp);

    return message.send({ embed });
  },
});
