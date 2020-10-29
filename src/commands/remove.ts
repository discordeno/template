// This command is intentionally done in an un-optimized way. This command is only to show you how to await a users response.
import { addReactions, botCache } from "../../deps.ts";
import { needReaction } from "../utils/collectors.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed, sendAlertResponse } from "../utils/helpers.ts";

botCache.commands.set(`remove`, {
  name: `remove`,
  guildOnly: true,
  execute: async (message) => {
    const member = message.member;
    if (!member) return;

    const options = [
      { reaction: "1️⃣", amount: 100 },
      { reaction: "2️⃣", amount: 200 },
      { reaction: "3️⃣", amount: 300 },
      { reaction: "4️⃣", amount: 400 },
    ];

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setDescription([
        "What is the first number you would like to use?",
        ...options.map((option, index) => `${index + 1}. ${option.amount}`),
      ].join("\n"));

    const questionMessage = await sendEmbed(
      message.channelID,
      embed,
    );
    // Add the reactions in order
    addReactions(
      message.channelID,
      questionMessage.id,
      options.map((option) => option.reaction),
      true,
    );

    const firstReaction = await needReaction(
      message.author.id,
      questionMessage.id,
    );
    const firstNumber = options.find((option) =>
      option.reaction === firstReaction
    );
    if (!firstNumber) {
      return sendAlertResponse(
        message,
        "The reaction you provided was invalid.",
      );
    }

    embed
      .setDescription([
        `**${firstNumber.amount}** Okay, cool! What would you like to use as the second number?`,
        ...options.map((option, index) => `${index + 1}. ${option.amount}`),
      ].join("\n"));

    const secondQuestion = await sendEmbed(message.channelID, embed);
    // Add the reactions in order
    addReactions(
      message.channelID,
      secondQuestion.id,
      options.map((option) => option.reaction),
      true,
    );

    const secondReaction = await needReaction(
      message.author.id,
      secondQuestion.id,
    );
    const secondNumber = options.find((option) =>
      option.reaction === secondReaction
    );
    if (!secondNumber) {
      return sendAlertResponse(
        message,
        "The reaction you provided was invalid.",
      );
    }

    const total = firstNumber.amount - secondNumber.amount;
    embed.setDescription(
      `The total of ${firstNumber.amount} - ${secondNumber.amount} is = **${total}**`,
    );
    sendEmbed(message.channelID, embed);
  },
});
