import { Collection } from "../../deps.ts";
import { Command } from "../types/commands.ts";

export const commands = new Collection<string, Command>();

export function createCommand(command: Command) {
  commands.set(command.name, command);
}
