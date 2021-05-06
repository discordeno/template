import { botId, higherRolePosition, highestRole } from "../../../deps.ts";
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
      maximum: 7,
      minimum: 0,
      defaultValue: 0,
    },
    {
      name: "reason",
      type: "...strings",
      defaultValue: "No reason given",
    },
  ] as const,
  userServerPermissions: ["BAN_MEMBERS"],
  botServerPermissions: ["BAN_MEMBERS"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  execute: async (message, args) => {
    try {
      const { guildId, channelId } = message;
      const authorId = message.authorId;
      const memberId = args.member.id;

      const botHighestRoleId = (await highestRole(guildId, botId))!.id;
      const memberHighestRoleId = (await highestRole(guildId, memberId))!.id;
      const authorHighestRoleId = (await highestRole(guildId, authorId))!.id;

      const canBotBanMember = await higherRolePosition(
        guildId,
        botHighestRoleId,
        memberHighestRoleId,
      );
      const canAuthorBanMember = await higherRolePosition(
        guildId,
        authorHighestRoleId,
        memberHighestRoleId,
      );

      if (!(canBotBanMember && canAuthorBanMember)) {
        const embed = new Embed()
          .setColor("#F04747")
          .setTitle("Could not Ban")
          .setDescription(
            "Cannot ban member with same or higher Roleposition than Author or Bot",
          )
          .setTimestamp();
        return sendEmbed(channelId, embed);
      }

      try {
        const embed = new Embed()
          .setColor("#F04747")
          .setTitle(`Banned from ${message.member?.guild.name}`)
          .addField("Banned By:", `<@${authorId}>`)
          .addField("Reason:", args.reason)
          .setTimestamp();
        await args.member.sendDM({ embed });
      } catch {
        console.error(
          `Could not notify member ${args.member.tag} for ban via DM`,
        );
      }

      const banned = await args.member.ban(guildId, {
        reason: args.reason,
        deleteMessageDays: args.days as BanDeleteMessageDays,
      }).catch(
        (console.error),
      );
      if (!banned) return;

      const embed = new Embed()
        .setColor("#F04747")
        .setTitle(`Banned User`)
        .setThumbnail(args.member.avatarURL)
        .addField("User:", args.member.mention, true)
        .addField("Banned By:", `<@${authorId}>`, true)
        .addField("Reason:", args.reason)
        .addField("Deleted DiscordenoMessage History:", `${args.days} Days`)
        .setTimestamp();

      return sendEmbed(channelId, embed);
    } catch {
      return message.reply("Attempt to ban user has failed!");
    }
  },
});

type BanDeleteMessageDays = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
