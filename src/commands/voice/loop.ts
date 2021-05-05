import { bot } from "../../../cache.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "loop",
  guildOnly: true,
  async execute(message) {
    bot.loopingMusics.set(message.guildId, true);

    return message.reply(
      `The current music will ${
        bot.loopingMusics.has(message.guildId)
          ? "now be looped 🔁"
          : `no longed be looped`
      }.`,
    );
  },
});
