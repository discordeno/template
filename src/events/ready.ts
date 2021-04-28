import {
  bot,
  cache,
  DiscordActivityTypes,
  editBotStatus,
  upsertSlashCommands,
} from "../../deps.ts";
import { Command } from "../types/commands.ts";
import { getTime } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";
import { registerTasks } from "./../utils/taskHelper.ts";

bot.eventHandlers.ready = async function () {
  editBotStatus({
    status: "dnd",
    activities: [{
      name: "Discordeno Best Lib",
      type: DiscordActivityTypes.Game,
      createdAt: Date.now(),
    }],
  });

  console.log(getTime(), `Loaded ${bot.arguments.size} Argument(s)`);
  console.log(getTime(), `Loaded ${bot.commands.size} Command(s)`);
  console.log(
    getTime(),
    `Loaded ${Object.keys(bot.eventHandlers).length} Event(s)`,
  );
  console.log(getTime(), `Loaded ${bot.inhibitors.size} Inhibitor(s)`);
  console.log(getTime(), `Loaded ${bot.monitors.size} Monitor(s)`);
  console.log(getTime(), `Loaded ${bot.tasks.size} Task(s)`);

  registerTasks();

  console.log(
    getTime(),
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );

  console.log(getTime(), `Preparing Slash Commands...`);

  const globalCommands = [];
  const perGuildCommands: Command[] = [];

  for (const command of bot.commands.values()) {
    if (!command.slash?.enabled) continue;

    // THIS COMMAND NEEDS SOME SLASH COMMAND STUFF
    if (command.slash.global) globalCommands.push(command.slash);
    if (command.slash.guild) perGuildCommands.push(command);
  }

  // GLOBAL COMMANDS CAN TAKE 1 HOUR TO UPDATE IN DISCORD
  if (globalCommands.length) {
    await upsertSlashCommands(globalCommands).catch(console.log);
  }

  // GUILD COMMANDS WILL UPDATE INSTANTLY
  await Promise.all(cache.guilds.map((guild) =>
    upsertSlashCommands(
      perGuildCommands.map((cmd) => {
        // USER OPTED TO USE BASIC VERSION ONLY
        if (cmd.slash?.advanced === false) {
          return {
            name: cmd.name,
            description: cmd.description,
            options: cmd.slash?.options,
          };
        }

        // ADVANCED VERSION WILL ALLOW TRANSLATION
        const name = translate(guild.id, `commands/${cmd.name}:SLASH_NAME`);
        const description = translate(
          guild.id,
          `commands/${cmd.name}:SLASH_DESCRIPTION`,
        );

        return {
          name: name === "SLASH_NAME" ? cmd.name : name,
          description: description === "SLASH_DESCRIPTION"
            ? cmd.description
            : description,
          options: cmd.slash?.options?.map((option) => {
            const optionName = translate(guild.id, option.name);
            const optionDescription = translate(
              guild.id,
              option.description,
            );

            return {
              ...option,
              name: optionName,
              description: optionDescription,
            };
          }),
        };
      }),
      guild.id,
    ).catch(console.log)
  ));

  console.log(getTime(), `Slash Commands loaded successfully!`);
};
