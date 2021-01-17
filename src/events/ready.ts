import {
  botCache,
  cache,
  editBotsStatus,
  StatusTypes,
  ActivityType,
} from "../../deps.ts";
import { registerTasks } from "./../utils/taskHelper.ts";

botCache.eventHandlers.ready = function () {
  editBotsStatus(
    StatusTypes.DoNotDisturb,
    "Discordeno Best Lib",
    ActivityType.Game
  );

  console.log(`Loaded ${botCache.arguments.size} Argument(s)`);
  console.log(`Loaded ${botCache.commands.size} Command(s)`);
  console.log(`Loaded ${Object.keys(botCache.eventHandlers).length} Event(s)`);
  console.log(`Loaded ${botCache.inhibitors.size} Inhibitor(s)`);
  console.log(`Loaded ${botCache.monitors.size} Monitor(s)`);
  console.log(`Loaded ${botCache.tasks.size} Task(s)`);

  registerTasks();

  console.log(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`
  );
};
