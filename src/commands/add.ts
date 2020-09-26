// This command is intentionally done in an un-optimized way. This command is only to show you how to await a users response.
import { botCache } from "../../mod.ts";
import { sendMessage } from "../../deps.ts";
import { needMessage } from "../utils/collectors.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.commands.set(`add`, {
  name: `add`,
  guildOnly: true,
  execute: async (message) => {
    sendMessage(
      message.channelID,
      "What is the first number you would like to add?",
    );
    const firstNumber = await needMessage(message.author.id, message.channelID);

    const member = message.member;
    if (!member) return;

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setDescription(
        `**${firstNumber.content}** Okay, cool! What would you like to add to ${firstNumber.content}?`,
      );

    sendEmbed(message.channelID, embed);
    const secondNumber = await needMessage(
      message.author.id,
      message.channelID,
    );

    embed.setDescription(
      `The total of ${firstNumber.content} + ${secondNumber.content} is = **${Number(
        firstNumber.content,
      ) + Number(secondNumber.content)}**`,
    );
    sendEmbed(message.channelID, embed);
  },
});
