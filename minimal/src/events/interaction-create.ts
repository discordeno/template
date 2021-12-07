import {
  bgBlack,
  bgYellow,
  black,
  white,
  InteractionResponseTypes,
  BotWithCache,
  DiscordenoGuild
} from "../../deps.ts";
import { events } from "./mod.ts";
import { logger } from "../utils/logger.ts";
import { getGuildFromId } from "../utils/helpers.ts";

const log = logger({ name: "Event: InteractionCreate" });

events.interactionCreate = async (rawBot, interaction) => {
  const bot = rawBot as BotWithCache;

  if (interaction.data) {
    if (interaction.id) {
      let guildName = "Direct Message";
      let guild = {} as DiscordenoGuild;

      // Set guild, if there was an error getting the guild, then just say it was a DM. (What else are we going to do?)
      if (interaction.guildId) {
        const guildOrVoid = await getGuildFromId(bot, interaction.guildId).catch((err) => {
          log.error(err);
        });
        if (guildOrVoid) {
          guild = guildOrVoid;
          guildName = guild.name;
        }
      }

      log.info(
        `[Command: ${bgYellow(black(interaction.data.name as string))} - ${bgBlack(white(`Trigger`))}] by ${
          interaction.user.username
        }#${interaction.user.discriminator} in ${guildName}${guildName !== "Direct Message" ? ` (${guild.id})` : ``}`
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
