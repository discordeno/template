import { botCache } from "../../mod.ts";

botCache.arguments.set("number", {
  name: "number",
  execute: function (_argument, parameters) {
    const [number] = parameters;

    const valid = Number(number);
    if (valid) return valid;
  },
});
