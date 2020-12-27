import { Embed } from "./../utils/Embed.ts";
import { botID, cache } from "../../deps.ts";
import { createCommand } from "../utils/helpers.ts";

createCommand({
  name: `stats`,
  guildOnly: true,
  execute: (message) => {
    let totalMemberCount = 0;
    let cachedMemberCount = 0;

    for (const guild of cache.guilds.values()) {
      totalMemberCount += guild.memberCount;
      cachedMemberCount += guild.members.size;
    }

    const embed = new Embed()
      .setAuthor(`${message.guild?.botMember?.nick || message.guild?.bot?.tag} Stats`, message.guild?.bot?.avatarURL)
      .setColor("random")
      .addField("Guilds:", cache.guilds.size.toLocaleString(), true)
      .addField("Total Members:", totalMemberCount.toLocaleString(), true)
      .addField("Cached Members:", cachedMemberCount.toLocaleString(), true)
      .addField("Channels:", cache.channels.size.toLocaleString(), true)
      .addField("Messages:", cache.messages.size.toLocaleString(), true)
      .addField("Deno Version:", `v${Deno.version.deno}`, true)
      .setTimestamp();

    return message.send({ embed });
  },
});
