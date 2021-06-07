import { ComponentInteraction, DiscordInteractionTypes, SlashCommandInteraction } from "../../deps.ts";
import { processButtonCollectors } from "../utils/collectors.ts";
import { bot } from "../../cache.ts";

bot.eventHandlers.interactionCreate = function (data, member) {
  // A SLASH COMMAND WAS USED
  if (data.type === DiscordInteractionTypes.ApplicationCommand) {
    const command = (data as SlashCommandInteraction).data?.name
      ? bot.commands.get((data as SlashCommandInteraction).data!.name!)
      : undefined;
    if (!command) return;

    command.slash?.execute(data as SlashCommandInteraction, member);
  }

  // A BUTTON WAS CLICKED
  if (data.type === DiscordInteractionTypes.MessageComponent) {
    processButtonCollectors(data as ComponentInteraction, member);
  }
};
