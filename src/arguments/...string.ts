import { botCache } from "../../mod.ts";

botCache.arguments.set("...string", {
  name: "...string",
  execute: function (argument, parameters) {
    if (!parameters.length) return;

    return argument.lowercase
      ? parameters.join(" ").toLowerCase()
      : parameters.join(" ");
  },
});
