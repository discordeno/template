import { createCommandAliases, sendEmbed } from "../utils/helpers.ts";
import {
  deleteMessages,
  getMessages,
  sendMessage,
} from "../../deps.ts";

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
      defaultValue: "No reason given",
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
      const messagesToDelete = await getMessages(
        message.channel,
        { limit: 100 },
      );
      if (!messagesToDelete) return;

      await deleteMessages(
        message.channel,
        // + 1 to include the message that triggered the command
        messagesToDelete.slice(0, args.count + 1).map((m) => m.id),
      );

      const embed = new Embed()
        .setColor("#FFA500")
        .setTitle("Purged messages")
        .addField("Channel:", `<#${message.channelID}>`, true)
        .addField("Total:", args.count.toString(), true)
        .addField("Reason:", args.reason)
        .setTimestamp();

      return sendEmbed(message.channel, embed);
    } catch (error) {
      console.error(error);

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
