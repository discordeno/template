import { commandHandler } from "../monitors/commandHandler.ts";
import { botCache } from "../../mod.ts";

botCache.eventHandlers.messageCreate = function (message) {
  commandHandler(message);
};
