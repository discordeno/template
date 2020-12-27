// This file is meant to show how you can create multiple commands in the same file if you wish.
import { cache } from "../../deps.ts";
import { createCommand } from "../utils/helpers.ts";

createCommand({
  name: `ping`,
  description: "commands/ping:DESCRIPTION",
  botChannelPermissions: ["SEND_MESSAGES"],
  execute: function (message) {
    message.send(`Ping MS: ${Date.now() - message.timestamp}ms`);
  },
});

createCommand({
  name: `devping`,
  guildOnly: true,
  execute: function (message) {
    let memberCount = 0;
    cache.guilds.forEach((guild) => {
      memberCount += guild.members.size;
    });

    message.send(`Ping MS: ${Date.now() - message.timestamp}ms | Guilds: ${cache.guilds.size} | Users: ${memberCount}`);
  },
});
