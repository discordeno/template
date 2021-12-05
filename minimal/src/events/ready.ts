import { editBotStatus, ActivityTypes } from "../../deps.ts";
import { events } from "./mod.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "Event: Ready" });

events.ready = (bot) => {
  editBotStatus(bot, {
    status: "online",
    activities: [
      {
        name: "Discordeno is Best Lib",
        type: ActivityTypes.Game,
        createdAt: Date.now()
      }
    ]
  });
  log.info("Bot Ready");
};
