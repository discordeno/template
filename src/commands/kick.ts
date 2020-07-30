import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/handlers/channel.ts";
import { Member } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/structures/member.ts";
import { kick } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/handlers/member.ts";
import { deleteMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/master/handlers/message.ts";
import { botCache } from "../../mod.ts";
import { createCommandAliases, sendResponse } from "../utils/helpers.ts";
import { Embed } from "../utils/Embed.ts";
import { Args } from "../types/commands.ts";

botCache.commands.set(`kick`, {
  name: `kick`,
  description: "Kick command.",
  // adds cooldowns to the command
  cooldown: {
    // usages in certain duration of seconds below
    allowedUses: 1,
    // the cooldown
    seconds: 10,
  },
  // Prevents it from being used in dms
  guildOnly: true,
  botServerPermissions: ["ADMINISTRATOR"],
  userServerPermissions: ["KICK_MEMBERS"],
  arguments: [
    {
      name: "member",
      type: "member",
      missing: function (message) {
        sendResponse(message, `User cannot be found.`);
      },
      // By default this is true but for the purpose of the guide so you can see this exists.
      required: true,
    },
    {
      name: "reason",
      // The leftover string provided by the user that was not used by previous args.
      type: "...string",
      defaultValue: "No reason provided.",
      // It is silly to lowercase this but for the purpose of the guide you can see that this is also available to you.
      lowercase: true,
    },
  ],
  execute: function (message, args: KickArgs, guild) {
    if (!guild) return;
    // setting up the embed for report/log
    const embed = new Embed()
      .setDescription(`Report: ${args.member.mention} Kick`)
      .addField("Reason >", `${args.reason}`)
      .addField("Time", message.timestamp.toString());

    const reportchannel = guild.channels.find((channel) =>
      channel.name === "report"
    );
    if (!reportchannel) {
      return sendResponse(message, "*`Report channel cannot be found!`*");
    }

    // Delete the message command
    deleteMessage(message, "Remove kick command trigger.");
    // Kick the user with reason
    kick(guild, args.member.user.id, args.reason);
    // sends the kick report into log/report
    sendMessage(reportchannel, embed);
  },
});

// other ways to call the command, must be in lowercase
createCommandAliases("kick", ["boot", "tempban"]);

interface KickArgs {
  member: Member;
  reason: string;
}
