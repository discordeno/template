import { events } from "./mod.ts";
import { BotWithCache } from "../../deps.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "Event: Ready" });

events.ready = (bot, {guilds}) => {
  updateCommands(bot as BotWithCache, { guilds });
  log.info("Bot Ready");
};
