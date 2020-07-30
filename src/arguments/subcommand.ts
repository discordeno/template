import { botCache } from "../../mod.ts";

botCache.arguments.set("subcommand", {
  name: "subcommand",
  execute: function (argument, parameters) {
    const [subcommand] = parameters;

    return argument.literals?.find((literal) =>
      literal.toLowerCase() === subcommand?.toLowerCase()
    );
  },
});
