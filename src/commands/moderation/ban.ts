import { botCache, Member, ban, sendMessage } from "./../../../deps.ts";
import { Embed } from "./../../utils/Embed.ts";
import { sendEmbed } from "./../../utils/helpers.ts";

botCache.commands.set(`ban`, {
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
  execute: async (message, args: BanArgs) => {
    try {
      await ban(message.guildID, args.member.id, {
        reason: args.reason,
        days: args.days,
      });

      const embed = new Embed()
        .setColor("#F04747;")
        .setTitle(`Banned User`)
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
