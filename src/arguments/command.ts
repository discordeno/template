import { bot } from "../../cache.ts";

bot.arguments.set("command", {
  name: "command",
  execute: function (_argument, parameters) {
    const [name] = parameters;
    if (!name) return;

    const commandName = name.toLowerCase();
    const command = bot.commands.get(commandName);
    if (command) return command;

    // Check if its an alias
    return bot.commands.find((cmd) =>
      Boolean(cmd.aliases?.includes(commandName))
    );
  },
});
