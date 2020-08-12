import { Embed } from "./../utils/Embed.ts";
import { Member } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/structures/member.ts";
import { botCache } from "../../mod.ts";
import { kick } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/member.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v7/src/handlers/channel.ts";

botCache.commands.set(`kick`, {
  name: `kick`,
  guildOnly: true,
  arguments: [
    {
      name: "member",
      type: "member",
      missing: (message) => {
        return sendMessage(message.channel, "User not found!");
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
  execute: async (message, args, guild) => {
    const member: Member = args.member;
    const reason: string = args.reason;

    try {
      await kick(guild!.id, member.user.id, reason);

      const embed = new Embed()
        .setColor("#FFA500")
        .setTitle(`Kicked User`)
        .addField("User:", `<@${member.user.id}>`, true)
        .addField("Kicked By:", `<@${message.author.id}>`, true)
        .addField("Reason:", reason)
        .setTimestamp(Date.now());

      return sendEmbed(message.channel, embed);
    } catch (error) {
      return sendMessage(message.channel, "Attempt to kick user has failed");
    }
  },
});
