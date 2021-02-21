import { botCache } from "../../cache.ts";
import { EMOJI_REGEX } from "../utils/constants/emoj_regex.ts";

botCache.arguments.set("...emoji", {
  name: "...emoji",
  execute: function (argument, parameters: string[]) {
    if (!parameters.length) return;

    const text = parameters.join(" ");

    const match = text?.match(EMOJI_REGEX);

    if (match && match.length > 0) {
      return match?.join("");
    }
  },
});
