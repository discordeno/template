import { botCache } from "../../mod.ts";
import { avatarURL } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/member.ts";
import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/channel.ts";

botCache.commands.set(`pfp`, {
  name: `pfp`,
  guildOnly: true,
  execute: function (message) {
    const member = message.mentions.length
      ? message.mentions()[0]
      : message.member();

    return sendMessage(message.channel, {
      embed: {
        author: {
          name: member.tag,
          icon_url: avatarURL(member),
        },
        description: "test hot reload 123",
        image: {
          url: avatarURL(member, 2048),
        },
      },
    });
  },
});


