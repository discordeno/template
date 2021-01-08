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
        return message.reply("User not found!");
      },
    },
  ],
  userServerPermissions: ["BAN_MEMBERS"],
  botServerPermissions: ["BAN_MEMBERS"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  execute: async (message, args: UnbanArgs) => {
    try {
      await message.guild?.unban(args.memberId);

      const embed = new Embed()
        .setColor("#43b581")
        .setTitle(`Unbanned User`)
        .setThumbnail(message.member!.avatarURL)
        .addField("User ID:", args.memberId, true)
        .addField("Unbanned By:", `<@${message.author.id}>`, true)
        .setTimestamp();

      return sendEmbed(message.channelID, embed);
    } catch (error) {
      return message.reply("Attempt to unban user has failed!");
    }
  },
});

interface UnbanArgs {
  memberId: string;
}
