import { botCache } from "../../mod.ts";

botCache.arguments.set("command", {
  name: "command",
  execute: async function (_argument, parameters) {
    const [name] = parameters;
    if (!name) return;

    const commandName = name.toLowerCase();
    const command = botCache.commands.get(commandName);
    if (command) return command;

    // Check if its an alias
    const alias = botCache.commandAliases.get(commandName);
    if (!alias) return;

    return botCache.commands.get(alias);
  },
});
