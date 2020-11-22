import { unban, sendMessage } from "./../../../deps.ts";
import { Embed } from "./../../utils/Embed.ts";
import { sendEmbed, createCommand } from "./../../utils/helpers.ts";

createCommand({
  name: `unban`,
  guildOnly: true,
  arguments: [
    {
      name: "memberId",
      type: "snowflake",
      missing: (message) => {
        return sendMessage(message.channelID, "User not found!");
      },
    },
  ],
  userServerPermissions: ["BAN_MEMBERS"],
  botServerPermissions: ["BAN_MEMBERS"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  execute: async (message, args: UnbanArgs) => {
    console.log(args.memberId)
    try {
      const member = message.member;
      if (!member) return;

      await unban(message.guildID, args.memberId);

      const embed = new Embed()
        .setColor("#43b581")
        .setTitle(`Unbanned User`)
        .setThumbnail(member.avatarURL)
        .addField("User ID:", args.memberId, true)
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
