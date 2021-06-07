import {
  avatarURL,
  DiscordApplicationCommandOptionTypes,
  DiscordInteractionResponseTypes,
  sendInteractionResponse,
  snowflakeToBigint,
} from "../../deps.ts";
import { createCommand } from "../utils/helpers.ts";
import { log } from "../utils/logger.ts";

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
        type: DiscordApplicationCommandOptionTypes.User,
      },
    ],
    async execute(data, member) {
      const arg = data.data?.options?.[0];

      if (arg?.type === DiscordApplicationCommandOptionTypes.User && arg?.value) {
        const targetUser = data.data?.resolved?.users?.[arg.value as string];
        if (!targetUser) return;

        const url = avatarURL(snowflakeToBigint(targetUser.id), Number(targetUser.discriminator), {
          avatar: targetUser.avatar ?? undefined,
          size: 2048,
        });

        return await sendInteractionResponse(snowflakeToBigint(data.id), data.token, {
          private: false,
          type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
          data: {
            embeds: [
              {
                author: {
                  name: `${targetUser.username}#${targetUser?.discriminator}`,
                  iconUrl: url,
                },
                image: {
                  url,
                },
              },
            ],
          },
        }).catch(log.error);
      }

      if (!member) return;

      return await sendInteractionResponse(snowflakeToBigint(data.id), data.token, {
        type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [
            {
              author: {
                name: member.tag,
                iconUrl: member.avatarURL,
              },
              image: {
                url: member.makeAvatarURL({ size: 2048 }),
              },
            },
          ],
        },
      }).catch(log.error);
    },
  },
  execute: (message) => {
    const mentioned = message.mentions?.[0];
    const member = message.guild?.members.get(mentioned?.id ? snowflakeToBigint(mentioned.id) : message.authorId);
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
