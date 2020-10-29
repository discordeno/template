import { botCache, botID, sendMessage } from "../../deps.ts";

botCache.commands.set(`invite`, {
  name: `invite`,
  execute: function (message) {
    // Replace the permission number at the end to request the permissions you wish to request. By default, this will request Admin perms.
    sendMessage(
      message.channelID,
      `https://discordapp.com/oauth2/authorize?client_id=${botID}&scope=bot&permissions=8`,
    );
  },
});
