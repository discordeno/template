import { bot } from "../../deps.ts";

bot.arguments.set("command", {
  name: "command",
  // deno-lint-ignore require-await
  execute: async function (_argument, parameters) {
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
