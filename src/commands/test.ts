import { Embed } from "./../utils/Embed.ts";
import {
  createCommand,
  createEmbedsButtonsPagination,
  createEmbedsPagination,
} from "../utils/helpers.ts";

createCommand({
  name: `test`,
  guildOnly: true,
  execute: async (message) => {
    const embeds: Embed[] = [];

    for (let i = 0; i < 10; i++) {
      embeds.push(
        new Embed()
          .setTitle(`Page ${i}`)
          .setTimestamp(Date.now())
          .setAuthor(
            `${message.guild?.botMember?.nick ||
              message.guild?.bot?.tag} Stats`,
            message.guild?.bot?.avatarURL,
          )
          .setColor("random"),
      );
    }

    return createEmbedsButtonsPagination(
      message.id,
      message.channelId,
      message.authorId,
      embeds,
    );
  },
});
