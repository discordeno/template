import { sendMessage, ban, highestRole, sendDirectMessage, Member, botID } from "./../../../deps.ts";
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
        return sendMessage(message.channelID, "User not found!");
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
      const botHighestRolePosition = (await highestRole(message.guildID, botID))!.position;
      const memberHighestRolePositon = (await highestRole(message.guildID, args.member.id))!.position;
      const authorHighestRolePosition = (await highestRole(message.guildID, message.author.id))!.position;

      if (memberHighestRolePositon >= botHighestRolePosition || memberHighestRolePositon >= authorHighestRolePosition) {
        throw new Error("Cannot ban member with same or higher Roleposition");
      }

      try {
        const embed = new Embed()
        .setColor("#F04747")
        .setTitle(`Banned from ${message.member?.guild.name}`)
        .addField("Banned By:", `<@${message.author.id}>`)
        .addField("Reason:", args.reason)
        .setTimestamp();
        await sendDirectMessage(args.member.id, { embed: embed });
      } catch {}


      await ban(message.guildID, args.member.id, {
        reason: args.reason,
        days: args.days,
      });

      const member = message.member;
      if (!member) return;

      const embed = new Embed()
        .setColor("#F04747")
        .setTitle(`Banned User`)
        .setThumbnail(member.avatarURL)
        .addField("User:", args.member.mention, true)
        .addField("Banned By:", `<@${message.author.id}>`, true)
        .addField("Reason:", args.reason)
        .addField("Deleted Message History:", `${args.days} Days`)
        .setTimestamp();

      return sendEmbed(message.channelID, embed);
    } catch (error) {
      return sendMessage(message.channelID, "Attempt to ban user has failed!");
    }
  },
});

interface BanArgs {
  member: Member;
  reason: string;
  days: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
