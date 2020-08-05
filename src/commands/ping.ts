// This file is meant to show how you can create multiple commands in the same file if you wish.
import { botCache } from "../../mod.ts";
import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/utils/cache.ts";
import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/channel.ts";

botCache.commands.set(`ping`, {
  name: `ping`,
  execute: function (message) {
    sendMessage(
      message.channel,
      `Ping MS: ${Date.now() - message.timestamp}ms`,
    );
  },
});

botCache.commands.set(`devping`, {
  name: `devping`,
  guildOnly: true,
  execute: function (message) {
    let memberCount = 0;
    cache.guilds.forEach((guild) => {
      memberCount += guild.members.size;
    });

    sendMessage(
      message.channel,
      `Ping MS: ${Date.now() -
        message
          .timestamp}ms | Guilds: ${cache.guilds.size} | Users: ${memberCount}`,
    );
  },
});
