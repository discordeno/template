import { botID, higherRolePosition, highestRole, Member, sendDirectMessage } from "../../../deps.ts";
import { Embed } from "./../../utils/Embed.ts";
import { createCommand, sendEmbed } from "./../../utils/helpers.ts";

createCommand({
  name: `ban`,
  guildOnly: true,
  arguments: [
    {
      name: "member",
      type: "member",
      missing: (message) => {
        return message.reply("User not found!");
      },
    },
    {
      name: "days",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "reason",
      type: "...string",
      defaultValue: "No reason given",
    },
  ],
  userServerPermissions: ["BAN_MEMBERS"],
  botServerPermissions: ["BAN_MEMBERS"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  execute: async (message, args: BanArgs) => {
    try {
      const { guildID, channelID } = message;
      const authorID = message.author.id;
      const memberID = args.member.id;

      const { reason, days } = args;

      const botHighestRoleId = (await highestRole(guildID, botID))!.id;
      const memberHighestRoleId = (await highestRole(guildID, memberID))!.id;
      const authorHighestRoleId = (await highestRole(guildID, authorID))!.id;

      const canBotBanMember = await higherRolePosition(guildID, botHighestRoleId, memberHighestRoleId)
      const canAuthorBanMember = await higherRolePosition(guildID, authorHighestRoleId, memberHighestRoleId)

      if (!(canBotBanMember && canAuthorBanMember)) {
        const embed = new Embed()
        .setColor("#F04747")
        .setTitle("Could not Ban")
        .setDescription("Cannot ban member with same or higher Roleposition than Author or Bot")
        .setTimestamp();
        return sendEmbed(channelID, embed);
      }

      try {
        const embed = new Embed()
        .setColor("#F04747")
        .setTitle(`Banned from ${message.member?.guild.name}`)
        .addField("Banned By:", `<@${authorID}>`)
        .addField("Reason:", reason)
          .setTimestamp();
        await args.member.sendDM({ embed });
      } catch {}


      const banned = await args.member.ban(guildID, { reason, days }).catch((console.error));
      if (!banned) return;

      const embed = new Embed()
        .setColor("#F04747")
        .setTitle(`Banned User`)
        .setThumbnail(args.member.avatarURL)
        .addField("User:", args.member.mention, true)
        .addField("Banned By:", `<@${authorID}>`, true)
        .addField("Reason:", reason)
        .addField("Deleted Message History:", `${days} Days`)
        .setTimestamp();

      return sendEmbed(channelID, embed);
    } catch (error) {
      return message.reply("Attempt to ban user has failed!");
    }
  },
});

interface BanArgs {
  member: Member;
  reason: string;
  days: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
