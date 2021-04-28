import { bot, DiscordInteractionTypes } from "../../deps.ts";

bot.eventHandlers.interactionCreate = function (data, member) {
  // A SLASH COMMAND WAS USED
  if (data.type === DiscordInteractionTypes.ApplicationCommand) {
    const command = data.data ? bot.commands.get(data.data.name) : undefined;
    if (!command) return;

    command.slash?.execute(data, member);
  }
};
