import { customCache } from "../cache.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "Event: Ready" });

customCache.events.ready = () => {
  log.info("Bot Ready!");
};
