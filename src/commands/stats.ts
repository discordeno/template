import { botID } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/module/client.ts";
import { botCache } from "../../mod.ts";
import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/cache.ts";
import { avatarURL } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/member.ts";
import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/channel.ts";

botCache.commands.set(`stats`, {
  name: `stats`,
  guildOnly: true,
  execute: (message, _args, guild) => {
    let botMember = guild?.members.get(botID);

    if (!botMember) return;

    let memberCount = 0;

    cache.guilds.forEach((guild) => {
      memberCount += guild.members.size;
    });

    return sendMessage(message.channel, {
      embed: {
        author: {
          name: `${botMember?.nick || botMember?.user.username} Stats`,
          icon_url: avatarURL(botMember),
        },
        fields: [
          {
            name: "Guilds:",
            value: cache.guilds.size.toString(),
            inline: true,
          },
          {
            name: "Members:",
            value: memberCount.toString(),
            inline: true,
          },
          {
            name: "Channels:",
            value: cache.channels.size.toString(),
            inline: true,
          },
          {
            name: "Messages:",
            value: cache.messages.size.toString(),
            inline: true,
          },
          {
            name: "Deno version:",
            value: `v${Deno.version.deno}`,
            inline: true,
          },
        ],
      },
    });
  },
});
