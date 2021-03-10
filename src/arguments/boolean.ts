import { botCache } from "../../deps.ts";

botCache.arguments.set("boolean", {
  name: "boolean",
  execute: function (_argument, parameters) {
    const [boolean] = parameters;

    const valid = ["true", "false", "on", "off"].includes(boolean);
    if (valid) return ["true", "on"].includes(boolean);
  },
});
