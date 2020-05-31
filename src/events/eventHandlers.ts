import { guildCreate } from "./guildCreate.ts";
import { EventHandlers } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/options.ts";
import { ready } from "./ready.ts";
import { messageCreate } from "./messageCreate.ts";

export const eventHandlers: EventHandlers = {
  guildCreate,
  ready,
  messageCreate,
};
