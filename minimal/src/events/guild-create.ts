import { events } from "./mod.ts";
import { updateGuildCommands } from "../utils/helpers.ts";

events.guildCreate = (bot, guild) => updateGuildCommands(bot, guild);
