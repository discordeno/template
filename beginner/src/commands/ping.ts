import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { Bot } from "../../mod.ts";
import { humanizeMilliseconds, snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "ping",
  description: "Ping the Bot!",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (_, interaction) => {
    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `🏓 Pong! Ping ${ping}ms (${humanizeMilliseconds(ping)})`,
        },
      },
    );
  },
});
