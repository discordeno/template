import { bgBlack, bgYellow, black, white, yellow, green, red, BotWithCache, DiscordenoGuild } from "../../deps.ts";
import { events } from "./mod.ts";
import { logger } from "../utils/logger.ts";
import { getGuildFromId } from "../utils/helpers.ts";
import { commands } from "../commands/mod.ts";

const log = logger({ name: "Event: InteractionCreate" });

events.interactionCreate = async (rawBot, interaction) => {
  const bot = rawBot as BotWithCache;

  if (interaction.data && interaction.id) {
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
      `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${bgBlack(white(`Trigger`))}] by ${
        interaction.user.username
      }#${interaction.user.discriminator} in ${guildName}${guildName !== "Direct Message" ? ` (${guild.id})` : ``}`
    );

    if (interaction.data.name) {
      const command = commands.get(interaction.data.name);
      if (command) {
        try {
          command.execute(rawBot, interaction);
          log.info(
            `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${bgBlack(green(`Success`))}] by ${
              interaction.user.username
            }#${interaction.user.discriminator} in ${guildName}${
              guildName !== "Direct Message" ? ` (${guild.id})` : ``
            }`
          );
        } catch (err) {
          log.error(
            `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${bgBlack(red(`Error`))}] by ${
              interaction.user.username
            }#${interaction.user.discriminator} in ${guildName}${
              guildName !== "Direct Message" ? ` (${guild.id})` : ``
            }`
          );
          log.error(err);
        }
      } else {
        log.warn(
          `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${bgBlack(yellow(`Not Found`))}] by ${
            interaction.user.username
          }#${interaction.user.discriminator} in ${guildName}${guildName !== "Direct Message" ? ` (${guild.id})` : ``}`
        );
      }
    }
  }
};
