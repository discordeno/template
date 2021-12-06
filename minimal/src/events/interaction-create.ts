import { InteractionTypes } from "../../deps.ts";
import { events } from "./mod.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "Event: InteractionCreate" });

events.interactionCreate = (_bot, interaction) => {
  if (interaction.type === InteractionTypes.ApplicationCommand) {
    log.info("Application Command!");
  }
};
