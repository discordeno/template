import { botCache, Member, kick, sendMessage } from "../../deps.ts";
import { Embed } from "./../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.commands.set(`kick`, {
  name: `kick`,
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
      name: "reason",
      type: "...string",
      defaultValue: "No reason given",
    },
  ],
  userServerPermissions: [
    "KICK_MEMBERS",
  ],
  botServerPermissions: [
    "KICK_MEMBERS",
  ],
  execute: async (message, args: KickArgs) => {
    try {
      await kick(message.guildID, args.member.user.id, args.reason);

      const embed = new Embed()
        .setColor("#FFA500")
        .setTitle(`Kicked User`)
        .addField("User:", args.member.mention, true)
        .addField("Kicked By:", `<@${message.author.id}>`, true)
        .addField("Reason:", args.reason)
        .setTimestamp();

      return sendEmbed(message.channelID, embed);
    } catch (error) {
      return sendMessage(message.channelID, "Attempt to kick user has failed!");
    }
  },
});

interface KickArgs {
  member: Member;
  reason: string;
}
