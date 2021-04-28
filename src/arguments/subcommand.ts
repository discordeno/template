import { bot } from "../../deps.ts";

bot.arguments.set("subcommand", {
  name: "subcommand",
  execute: function (_argument, parameters, _message, command) {
    const [subcommandName] = parameters;

    return command.subcommands?.find((sub) =>
      sub.name === subcommandName ||
      Boolean(sub.aliases?.includes(subcommandName))
    );
  },
});
