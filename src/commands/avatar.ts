import { DiscordApplicationCommandOptionTypes } from "../../deps.ts";
import { createCommand } from "../utils/helpers.ts";

createCommand({
  name: `avatar`,
  guildOnly: true,
  slash: {
    enabled: true,
    guild: true,
    global: false,
    advanced: true,
    options: [
      {
        required: false,
        name: "commands/avatar:USER_NAME",
        description: "commands/avatar:USER_DESCRIPTION",
        type: DiscordApplicationCommandOptionTypes.USER,
      },
    ],
  },
  execute: (message) => {
    const mentioned = message.mentions?.[0];
    const member = message.guild?.members.get(
      mentioned?.id || message.author.id,
    );
    if (!member) return;

    return message.reply({
      embed: {
        author: {
          name: member.tag,
          iconUrl: member.avatarURL,
        },
        image: {
          url: member.makeAvatarURL({ size: 2048 }),
        },
      },
    });
  },
});
