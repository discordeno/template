import { botCache, unban, sendMessage } from "./../../../deps.ts";
import { Embed } from "./../../utils/Embed.ts";
import { sendEmbed } from "./../../utils/helpers.ts";

botCache.commands.set(`unban`, {
  name: `unban`,
  guildOnly: true,
  arguments: [
    {
      name: "memberId",
      type: "string",
      missing: (message) => {
        return sendMessage(message.channelID, "User not found!");
      },
    },
  ],
  userServerPermissions: ["BAN_MEMBERS"],
  botServerPermissions: ["BAN_MEMBERS"],
  execute: async (message, args: UnbanArgs) => {
    try {
      await unban(message.guildID, args.memberId);

      const embed = new Embed()
        .setColor("#43b581")
        .setTitle(`Unbanned User`)
        .addField("User:", `<@${args.memberId}>`, true)
        .addField("Unbanned By:", `<@${message.author.id}>`, true)
        .setTimestamp();

      return sendEmbed(message.channelID, embed);
    } catch (error) {
      return sendMessage(
        message.channelID,
        "Attempt to unban user has failed!"
      );
    }
  },
});

interface UnbanArgs {
  memberId: string;
}
