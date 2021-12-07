import { bgBlack, bgYellow, black, white, InteractionResponseTypes } from "../../deps.ts";
import { events } from "./mod.ts";
import { logger } from "../utils/logger.ts";
import { getGuildFromId } from "../utils/helpers.ts";
import { bot as realBot } from "../../mod.ts";

const log = logger({ name: "Event: InteractionCreate" });

events.interactionCreate = async (bot, interaction) => {
  if (interaction.data) {
    if (interaction.id) {
      const guildName = interaction.guildId
        ? await getGuildFromId(realBot, interaction.guildId).catch((err) => {
            log.error(err);
          })
        : `DM`;

      log.info(
        `[Command: ${bgYellow(black(interaction.data.name as string))} - ${bgBlack(white(`Trigger`))}] by ${
          interaction.user.username
        }#${interaction.user.discriminator} in ${guildName}`
      );

      await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Testing!"
        }
      });
    }
  }
};
