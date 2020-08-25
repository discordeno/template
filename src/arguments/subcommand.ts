import { botCache } from "../../mod.ts";

botCache.arguments.set("subcommand", {
  name: "subcommand",
  execute: function (argument, parameters, message, command) {
    const [subcommandName] = parameters;

    return command.subcommands?.find((sub) =>
      sub.name === subcommandName ||
      Boolean(sub.aliases?.includes(subcommandName))
    );
  },
});
