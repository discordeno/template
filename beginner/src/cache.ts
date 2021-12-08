import { Collection, EventHandlers } from "../deps.ts";
import { Command } from "./types/mod.ts";

export const customCache = {
  events: {} as Partial<EventHandlers>,
  commands: new Collection<string, Command>(),
};
