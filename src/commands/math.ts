import { botCache } from "../../deps.ts";
import { createSubcommand, sendEmbed } from "../utils/helpers.ts";
import { Embed } from "../utils/Embed.ts";

botCache.commands.set(`math`, {
  name: `math`,
  guildOnly: true,
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      defaultValue: "add",
    },
    { name: "firstNumber", type: "number" },
    { name: "secondNumber", type: "number" },
  ],
});

createSubcommand("math", {
  name: "add",
  guildOnly: true,
  arguments: [
    { name: "firstNumber", type: "number" },
    { name: "secondNumber", type: "number" },
  ],
  execute: (message, args: MathAddArgs) => {
    const member = message.member;
    if (!member) return;
    const total = args.firstNumber + args.secondNumber;

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setDescription(
        `The total of ${args.firstNumber} + ${args.secondNumber} is = **${total}**`,
      );
    sendEmbed(message.channelID, embed);
  },
});

createSubcommand("math", {
  name: "remove",
  guildOnly: true,
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      defaultValue: "normal",
    },
    { name: "firstNumber", type: "number" },
    { name: "secondNumber", type: "number" },
  ],
});

createSubcommand("math-remove", {
  name: "normal",
  guildOnly: true,
  arguments: [
    { name: "firstNumber", type: "number" },
    { name: "secondNumber", type: "number" },
  ],
  execute: (message, args: MathAddArgs) => {
    const member = message.member;
    if (!member) return;

    const total = args.firstNumber - args.secondNumber;

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setDescription(
        `The total of ${args.firstNumber} - ${args.secondNumber} is = **${total}**`,
      );
    sendEmbed(message.channelID, embed);
  },
});

createSubcommand("math-remove", {
  name: "double",
  guildOnly: true,
  arguments: [
    { name: "firstNumber", type: "number" },
    { name: "secondNumber", type: "number" },
  ],
  execute: (message, args: MathAddArgs) => {
    const member = message.member;
    if (!member) return;

    const total = (args.firstNumber - args.secondNumber) * 2;

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setDescription(
        `The total of (${args.firstNumber} - ${args.secondNumber}) * 2 is = **${total}**`,
      );
    sendEmbed(message.channelID, embed);
  },
});

interface MathAddArgs {
  firstNumber: number;
  secondNumber: number;
}
