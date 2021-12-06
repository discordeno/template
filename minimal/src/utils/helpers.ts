import { BotWithCache, MakeRequired, EditGlobalApplicationCommand, upsertApplicationCommands } from "../../deps.ts";
import { logger } from "./logger.ts";
import { commands } from "../commands/mod.ts";

const log = logger({ name: "Helpers" });

export async function updateCommands(bot: BotWithCache) {
  const globalCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];
  const perGuildCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];

  commands.forEach((command) => {
    if (command.scope) {
      if (command.scope === "Guild") {
        perGuildCommands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options ? command.options : undefined
        });
      } else if (command.scope === "Global") {
        globalCommands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options ? command.options : undefined
        });
      }
    } else {
      perGuildCommands.push({
        name: command.name,
        description: command.description,
        type: command.type,
        options: command.options ? command.options : undefined
      });
    }
  });

  if (globalCommands.length) {
    log.info("Updating Global Commands, this takes up to 1 hour to take effect...");
    await bot.helpers.upsertApplicationCommands(globalCommands).catch(log.error);
  }

  if (perGuildCommands.length) {
    bot.guilds.forEach((guild) => {
      upsertApplicationCommands(bot, perGuildCommands, guild.id);
    });
  }
}
