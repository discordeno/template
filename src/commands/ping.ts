// This file is meant to show how you can create multiple commands in the same file if you wish.
import { botCache } from "../../mod.ts";
import { cache, sendMessage } from "../../deps.ts";

botCache.commands.set(`ping`, {
  name: `ping`,
  description: "commands/ping:DESCRIPTION",
  botChannelPermissions: ["SEND_MESSAGES"],
  execute: function (message) {
    sendMessage(
      message.channelID,
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
      message.channelID,
      `Ping MS: ${Date.now() -
        message
          .timestamp}ms | Guilds: ${cache.guilds.size} | Users: ${memberCount}`,
    );
  },
});
