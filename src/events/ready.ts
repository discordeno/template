import { botCache } from "../../mod.ts";
import { cache, logger } from "../../deps.ts";

botCache.eventHandlers.ready = function () {
  logger.info(`Loaded ${botCache.arguments.size} Argument(s)`);
  logger.info(`Loaded ${botCache.commands.size} Command(s)`);
  logger.info(`Loaded ${Object.keys(botCache.eventHandlers).length} Event(s)`);
  logger.info(`Loaded ${botCache.inhibitors.size} Inhibitor(s)`);
  logger.info(`Loaded ${botCache.monitors.size} Monitor(s)`);
  logger.info(`Loaded ${botCache.tasks.size} Task(s)`);

  logger.success(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );
};
