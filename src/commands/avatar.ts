import { createCommand } from "../utils/helpers.ts";
import { Embed } from "../utils/Embed.ts";

createCommand({
  name: `avatar`,
  guildOnly: true,
  execute: (message) => {
    const memberID = message.mentions[0] || message.author.id;
    const member = message.guild?.members.get(memberID);
    if (!member) return;

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setImage(member.makeAvatarURL({ size: 2048, format: member.avatarURL.includes(".gif") ? "gif" : "png" }));

    return message.send({embed});
  },
});
