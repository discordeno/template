import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v2/structures/message.ts";
import { botCache, BotOptions } from "../../mod.ts";

export const inviteCommand = (message: Message) => {
  // Replace the permission number at the end to request the permissions you wish to request. By default, this will request Admin perms.
  return message.channel.sendMessage(
    `https://discordapp.com/oauth2/authorize?client_id=${BotOptions.botID}&scope=bot&permissions=8`,
  );
};

botCache.commands.set(`invite`, {
  callback: inviteCommand,
});
