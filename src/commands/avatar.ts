import { createCommand } from "../utils/helpers.ts";

createCommand({
  name: `avatar`,
  guildOnly: true,
  execute: (message) => {
    const memberID = message.mentions[0] || message.author.id;
    const member = message.guild?.members.get(memberID);
    if (!member) return;

    return message.reply({
      embed: {
        author: {
          name: member.tag,
          icon_url: member.avatarURL,
        },
        image: {
          url: member.makeAvatarURL({ size: 2048 }),
        },
      },
    });
  },
});
