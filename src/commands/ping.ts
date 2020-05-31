// This file is meant to show how you can create multiple commands in the same file if you wish.
import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message.ts";
import { botCache } from "../../mod.ts";
import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache.ts";
import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/channel.ts";

const pingCommand = (message: Message) => {
  return sendMessage(
    message.channel,
    `Ping MS: ${Date.now() - message.timestamp}ms`,
  );
};

const devPingCommand = (message: Message) => {
  let memberCount = 0;
  cache.guilds.forEach((guild) => {
    memberCount += guild.members.size;
  });
  return sendMessage(
    message.channel,
    `Ping MS: ${Date.now() -
      message
        .timestamp}ms | Guilds: ${cache.guilds.size} | Users: ${memberCount}`,
  );
};

botCache.commands.set(`ping`, {
  callback: pingCommand,
});

botCache.commands.set(`dev_ping`, {
  guildOnly: true,
  callback: devPingCommand,
});
