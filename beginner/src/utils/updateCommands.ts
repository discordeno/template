import { Bot } from "../../mod.ts";
import { commands } from "../commands/mod.ts";

export async function updateApplicationCommands() {
  await Bot.helpers.upsertApplicationCommands(
    commands
      // ONLY GLOBAL COMMANDS
      .filter((command) => !command.devOnly)
      .array(),
  );

  await Bot.helpers.upsertApplicationCommands(
    commands
      // ONLY GLOBAL COMMANDS
      .filter((command) => !!command.devOnly)
      .array(),
  );
}
