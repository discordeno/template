import { cache, DiscordenoMessage, Player, Track } from "../../deps.ts";
import { bot } from "../../cache.ts";

/** Convert milliseconds to MM:SS */
export function getMusicLength(milliseconds: number) {
  return milliseconds > 3600000
    ? new Date(milliseconds).toISOString().substr(11, 8)
    : new Date(milliseconds).toISOString().substr(14, 5);
}

function execQueue(message: DiscordenoMessage, player: Player) {
  if (!message.guildId) return;

  const queue = bot.musicQueues.get(message.guildId);
  if (!queue || queue.length === 0) {
    return;
  }

  player.play(queue[0]);

  player.once("end", async () => {
    if (!bot.loopingMusics.has(message.guildId)) {
      bot.musicQueues.get(message.guildId)?.shift();
    }
    if (bot.musicQueues.get(message.guildId)!.length > 0) {
      setTimeout(() => {
        execQueue(message, player);
      }, 1000);
    } else {
      await bot.lavadenoManager.destroy(message.guildId.toString());
      bot.musicQueues.delete(message.guildId);
      await message.send(`Queue is now empty! Leaving the voice channel.`);
    }
  });
}

export async function addSoundToQueue(
  message: DiscordenoMessage,
  track: Track,
) {
  if (!message.guildId) return;

  const player = bot.lavadenoManager.players.get(message.guildId.toString());
  if (bot.musicQueues.has(message.guildId)) {
    bot.musicQueues.get(message.guildId)?.push(track);
    await message.reply(
      `Added ${track.info.title} to the queue! Position in queue: ${bot
        .musicQueues.get(message.guildId)!.length - 1}`,
    );
  } else {
    bot.musicQueues.set(message.guildId!, [track]);
    await message.reply(
      `Added ${track.info.title} to Now playing - ${track.info.title}.`,
    );
  }
  if (player && !player.playing) {
    await execQueue(message, player);
  }
}

export async function addPlaylistToQueue(
  message: DiscordenoMessage,
  playlistName: string,
  tracks: Track[],
) {
  const player = bot.lavadenoManager.players.get(message.guildId.toString());
  if (bot.musicQueues.has(message.guildId)) {
    bot.musicQueues.set(
      message.guildId,
      bot.musicQueues.get(message.guildId)!.concat(tracks),
    );
  } else {
    bot.musicQueues.set(message.guildId, tracks);
  }
  await message.reply(
    `Added ${tracks.length} songs from the playlist: ${playlistName} to the queue!`,
  );
  if (player && !player.playing) {
    await execQueue(message, player);
  }
}

export function validURL(str: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return !!pattern.test(str);
}

export async function checkIfUserInMusicChannel(
  message: DiscordenoMessage,
  player: Player,
): Promise<boolean> {
  if (!message.guildId || !message.channelId) {
    if (!player) {
      await message.reply(`The bot is not in any channel!`);
      return false;
    }
  }
  if (!cache.guilds.get(message.guildId)?.voiceStates.has(message.authorId)) {
    await message.reply(`You need to been in a voice channel!`);
    return false;
  }
  if (
    player.channel !==
      cache.guilds.get(message.guildId)?.voiceStates.get(message.authorId)
        ?.channelId
  ) {
    await message.reply(
      `You need to been in the same voice channel than the bot!`,
    );
    return false;
  }
  return true;
}
