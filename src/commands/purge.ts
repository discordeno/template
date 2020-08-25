import {
  avatarURL,
  botID,
  deleteMessage,
  getMessage,
  sendMessage,
} from "../../deps.ts";
import { createCommandAliases, sendEmbed } from "../utils/helpers.ts";

import { Embed } from "../utils/Embed.ts";
import { botCache } from "../../mod.ts";

botCache.commands.set("purge", {
  name: "purge",
  arguments: [
    {
      name: "count",
      type: "number",
      defaultValue: 1,
    },
    {
      name: "reason",
      type: "...string",
      defaultValue: "No reason givin",
    },
  ],
  userChannelPermissions: [
    "MANAGE_MESSAGES",
  ],
  botChannelPermissions: [
    "MANAGE_MESSAGES",
  ],
  guildOnly: true,
  execute: async function (message, args: PurgeArgs, guild) {
    try {
      let deletedCount = 0;

      while (deletedCount <= args.count) {
        if (!message.channel.lastMessageID) continue;

        let toDelete = await getMessage(
          message.channel,
          message.channel.lastMessageID,
        );

        await deleteMessage(toDelete, args.reason);

        deletedCount++;
      }

      deletedCount--;

      const embed = new Embed()
        .setColor("#FFA500")
        .setTitle("Purged messages")
        .addField("Channel:", `<#${message.channelID}>`, true)
        .addField("Total:", deletedCount.toString(), true)
        .addField("Reason:", args.reason)
        .setTimestamp();

      return sendEmbed(message.channel, embed);
    } catch (error) {
      return sendMessage(
        message.channel,
        "Attempt to delete messages has failed!",
      );
    }
  },
});

createCommandAliases("purge", ["delete"]);

interface PurgeArgs {
  count: number;
  reason: string;
}
