import {
  cache,
  DiscordActivityTypes,
  editBotStatus,
  upsertSlashCommands,
} from "../../deps.ts";
import { Command } from "../types/commands.ts";
import { Milliseconds } from "../utils/constants/time.ts";
import { getTime } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";
import { registerTasks } from "./../utils/taskHelper.ts";
import { sweepInactiveGuildsCache } from "./dispatch_requirements.ts";
import { bot } from "../../cache.ts";

bot.eventHandlers.ready = async function () {
  editBotStatus({
    status: "dnd",
    activities: [
      {
        name: "Discordeno Best Lib",
        type: DiscordActivityTypes.Game,
        createdAt: Date.now(),
      },
    ],
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

  // Special task which should only run every hour AFTER STARTUP
  setInterval(sweepInactiveGuildsCache, Milliseconds.HOUR);

  registerTasks();

  await bot.lavadenoManager.init();

  bot.fullyReady = true;

  console.log(
    getTime(),
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );

  console.log(getTime(), `Preparing Slash Commands...`);

  const globalCommands = [];
  // deno-lint-ignore no-explicit-any
  const perGuildCommands: Command<any>[] = [];

  for (const command of bot.commands.values()) {
    if (!command.slash?.enabled) continue;

    // THIS COMMAND NEEDS SOME SLASH COMMAND STUFF
    if (command.slash.global) globalCommands.push(command.slash);
    if (command.slash.guild) perGuildCommands.push(command);
  }

  // GLOBAL COMMANDS CAN TAKE 1 HOUR TO UPDATE IN DISCORD
  if (globalCommands.length) {
    console.log(
      getTime(),
      `Updating Global Slash Commands... Any changes will take up to 1 hour to update on discord.`,
    );
    await upsertSlashCommands(globalCommands).catch(console.log);
  }

  // GUILD COMMANDS WILL UPDATE INSTANTLY
  await Promise.all(
    cache.guilds.map(async (guild) => {
      await upsertSlashCommands(
        perGuildCommands.map((cmd) => {
          // USER OPTED TO USE BASIC VERSION ONLY
          if (cmd.slash?.advanced === false) {
            return {
              name: cmd.name,
              description: cmd.description || "No description available.",
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
              ? cmd.description || "No description available."
              : description,
            options: cmd.slash?.options?.map((option) => {
              const optionName = translate(guild.id, option.name);
              const optionDescription = translate(guild.id, option.description);

              return {
                ...option,
                name: optionName,
                description: optionDescription || "No description available.",
              };
            }),
          };
        }),
        guild.id,
      ).catch(console.log);
      console.log(
        getTime(),
        `Updated Guild ${guild.name} (${guild.id}) Slash Commands...`,
      );
    }),
  );

  console.log(getTime(), `[READY] Slash Commands loaded successfully!`);
};
