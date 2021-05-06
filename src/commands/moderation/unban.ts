import { snowflakeToBigint } from "../../../deps.ts";
import { Embed } from "./../../utils/Embed.ts";
import { createCommand, sendEmbed } from "./../../utils/helpers.ts";

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
  ] as const,
  userServerPermissions: ["BAN_MEMBERS"],
  botServerPermissions: ["BAN_MEMBERS"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  execute: async (message, args) => {
    try {
      await message.guild?.unban(snowflakeToBigint(args.memberId));

      const embed = new Embed()
        .setColor("#43b581")
        .setTitle(`Unbanned User`)
        .setThumbnail(message.member!.avatarURL)
        .addField("User ID:", args.memberId, true)
        .addField("Unbanned By:", `<@${message.authorId}>`, true)
        .setTimestamp();

      return sendEmbed(message.channelId, embed);
    } catch {
      return message.reply("Attempt to unban user has failed!");
    }
  },
});
