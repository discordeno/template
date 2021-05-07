import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "loop",
  guildOnly: true,
  execute(message) {
    if (bot.loopingMusics.has(message.guildId)) {
      bot.loopingMusics.delete(message.guildId);
    } else {
      bot.loopingMusics.set(message.guildId, true);
    }

    return message.reply(
      `The current music will ${
        bot.loopingMusics.has(message.guildId)
          ? "now be looped 🔁"
          : `no longed be looped`
      }.`,
    );
  },
});
