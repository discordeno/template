import { botCache } from "../../deps.ts";

botCache.arguments.set("command", {
  name: "command",
  execute: async function (_argument, parameters) {
    const [name] = parameters;
    if (!name) return;

    const commandName = name.toLowerCase();
    const command = botCache.commands.get(commandName);
    if (command) return command;

    // Check if its an alias
    return botCache.commands.find((cmd) =>
      Boolean(cmd.aliases?.includes(commandName))
    );
  },
});
