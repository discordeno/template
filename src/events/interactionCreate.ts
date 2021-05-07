import { DiscordInteractionTypes } from "../../deps.ts";
import { processButtonCollectors } from "../utils/collectors.ts";
import { bot } from "../../cache.ts";

bot.eventHandlers.interactionCreate = function (data, member) {
  // A SLASH COMMAND WAS USED
  if (data.type === DiscordInteractionTypes.ApplicationCommand) {
    const command = data.data?.name
      ? bot.commands.get(data.data.name)
      : undefined;
    if (!command) return;

    command.slash?.execute(data, member);
  }

  // A BUTTON WAS CLICKED
  if (data.type === DiscordInteractionTypes.Button) {
    processButtonCollectors(data, member);
  }
};
