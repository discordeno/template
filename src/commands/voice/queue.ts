import { bot } from "../../../cache.ts";
import { Embed } from "../../utils/Embed.ts";
import { createCommand } from "../../utils/helpers.ts";
import { getMusicLength } from "../../utils/voice.ts";

createCommand({
  name: "queue",
  guildOnly: true,
  execute(message) {
    const player = bot.lavadenoManager.players.get(message.guildId.toString());
    const queue = bot.musicQueues.get(message.guildId);

    if (!player || !queue) {
      return message.reply(`The bot is not currently playing music`);
    }

    const embed = new Embed()
      .setAuthor(
        "Isekai Music",
        "https://cdn.discordapp.com/avatars/833417537449754657/097a32a4f7bb5821f5383c4ddeb69aa8.png?size=256",
      )
      .setTitle("Music Queue")
      .setDescription(
        queue?.length > 0
          ? `Now Playing${
            bot.loopingMusics.has(message.guildId) ? ` 🔁 ` : ""
          }: [${queue[0].info.title}](${queue[0].info.uri}) | ${
            getMusicLength(queue[0].info.length)
          }\n${
            queue
              .slice(1)
              .map((track, i) => {
                return `${i + 1} - [${track.info.title}](${track.info.uri}) | ${
                  getMusicLength(track.info.length)
                }`;
              })
              .join("\n")
          }`.slice(0, 2048)
          : `The queue is empty, add a music first.`,
      )
      .setTimestamp(player.timestamp);

    return message.reply({ embed });
  },
});
