import { configs } from "../../configs.ts";
import { bot } from "../../cache.ts";
import {
  bgBlack,
  bgBlue,
  bgGreen,
  bgMagenta,
  bgYellow,
  black,
  botId,
  cache,
  deleteMessages,
  DiscordenoMessage,
  green,
  red,
  white,
} from "../../deps.ts";
import { Command } from "../types/commands.ts";
import { needMessage } from "../utils/collectors.ts";
import { handleError } from "../utils/errors.ts";
import { getTime } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

export function parsePrefix(guildId: bigint | undefined) {
  const prefix = guildId ? bot.guildPrefixes.get(guildId) : configs.prefix;
  return prefix || configs.prefix;
}

export function parseCommand(commandName: string) {
  const command = bot.commands.get(commandName);
  if (command) return command;

  // Check aliases if the command wasn't found
  return bot.commands.find((cmd) =>
    Boolean(cmd.aliases?.includes(commandName))
  );
}

export function logCommand(
  message: DiscordenoMessage,
  guildName: string,
  type: "Failure" | "Success" | "Trigger" | "Slowmode" | "Missing" | "Inhibit",
  commandName: string,
) {
  const command = `[COMMAND: ${
    bgYellow(
      black(commandName || "Unknown"),
    )
  } - ${
    bgBlack(
      ["Failure", "Slowmode", "Missing"].includes(type)
        ? red(type)
        : type === "Success"
        ? green(type)
        : white(type),
    )
  }]`;

  const user = bgGreen(black(`${message.tag}(${message.authorId})`));
  const guild = bgMagenta(
    black(`${guildName}${message.guildId ? `(${message.guildId})` : ""}`),
  );

  console.log(
    `${
      bgBlue(
        `[${getTime()}]`,
      )
    } => ${command} by ${user} in ${guild} with MessageID: ${message.id}`,
  );
} /** Parses all the arguments for the command based on the message sent by the user. */

async function parseArguments(
  message: DiscordenoMessage,
  // deno-lint-ignore no-explicit-any
  command: Command<any>,
  parameters: string[],
) {
  const args: { [key: string]: unknown } = {};
  if (!command.arguments) return args;

  let missingRequiredArg = false;

  // Clone the parameters so we can modify it without editing original array
  const params = [...parameters];

  // Loop over each argument and validate
  for (const argument of command.arguments) {
    const resolver = bot.arguments.get(argument.type || "string");
    if (!resolver) continue;

    const result = await resolver.execute(argument, params, message, command);
    if (result !== undefined) {
      // Assign the valid argument
      args[argument.name] = result;
      // This will use up all args so immediately exist the loop.
      if (
        argument.type &&
        [
          "subcommands",
          "...strings",
          "...roles",
          "...emojis",
          "...snowflakes",
        ].includes(argument.type)
      ) {
        break;
      }
      // Remove a param for the next argument
      params.shift();
      continue;
    }

    // Invalid arg provided.
    if (Object.prototype.hasOwnProperty.call(argument, "defaultValue")) {
      args[argument.name] = argument.defaultValue;
    } else if (argument.required !== false) {
      if (argument.missing) {
        missingRequiredArg = true;
        argument.missing?.(message);
        break;
      }

      // A REQUIRED ARG WAS MISSING TRY TO COLLECT IT
      const question = await message
        .reply(
          translate(message.guildId, "strings:MISSING_REQUIRED_ARG", {
            name: argument.name,
            type: argument.type === "subcommand"
              ? command.subcommands?.map((sub) => sub.name).join(", ") ||
                "subcommand"
              : argument.type,
          }),
        )
        .catch(console.log);
      if (question) {
        const response = await needMessage(
          message.authorId,
          message.channelId,
        ).catch(console.log);
        if (response) {
          const responseArg = await resolver.execute(
            argument,
            [response.content],
            message,
            command,
          );
          if (responseArg) {
            args[argument.name] = responseArg;
            params.shift();
            await deleteMessages(message.channelId, [
              question.id,
              response.id,
            ]).catch(console.log);
            continue;
          }
        }
      }

      // console.log("Required Arg Missing: ", message.content, command, argument);
      missingRequiredArg = true;
      argument.missing?.(message);
      break;
    }
  }

  // If an arg was missing then return false so we can error out as an object {} will always be truthy
  return missingRequiredArg ? false : args;
}

/** Runs the inhibitors to see if a command is allowed to run. */
async function commandAllowed(
  message: DiscordenoMessage,
  // deno-lint-ignore no-explicit-any
  command: Command<any>,
) {
  const inhibitorResults = await Promise.all(
    [...bot.inhibitors.values()].map((inhibitor) =>
      inhibitor(message, command)
    ),
  );

  if (inhibitorResults.includes(true)) {
    logCommand(message, message.guild?.name || "DM", "Inhibit", command.name);
    return false;
  }

  return true;
}

async function executeCommand(
  message: DiscordenoMessage,
  // deno-lint-ignore no-explicit-any
  command: Command<any>,
  parameters: string[],
) {
  try {
    // bot.slowmode.set(message.author.id, message.timestamp);

    // Parsed args and validated
    const args = await parseArguments(message, command, parameters);
    // Some arg that was required was missing and handled already
    if (!args) {
      return logCommand(
        message,
        message.guild?.name || "DM",
        "Missing",
        command.name,
      );
    }

    // If no subcommand execute the command
    const [argument] = command.arguments || [];
    const subcommand = argument
      ? // deno-lint-ignore no-explicit-any
        (args[argument.name] as Command<any>)
      : undefined;

    if (!argument || argument.type !== "subcommand" || !subcommand) {
      // Check subcommand permissions and options
      if (!(await commandAllowed(message, command))) return;

      // @ts-ignore - a comment to satisfy lint
      await command.execute?.(message, args);
      return logCommand(
        message,
        message.guild?.name || "DM",
        "Success",
        command.name,
      );
    }

    // A subcommand was asked for in this command
    if (
      ![subcommand.name, ...(subcommand.aliases || [])].includes(parameters[0])
    ) {
      executeCommand(message, subcommand, parameters);
    } else {
      const subParameters = parameters.slice(1);
      executeCommand(message, subcommand, subParameters);
    }
  } catch (error) {
    console.log(error);
    logCommand(message, message.guild?.name || "DM", "Failure", command.name);
    handleError(message, error);
  }
}

// The monitor itself for this file. Above is helper functions for this monitor.
bot.monitors.set("commandHandler", {
  name: "commandHandler",
  ignoreDM: false,
  /** The main code that will be run when this monitor is triggered. */
  // deno-lint-ignore require-await
  execute: async function (message) {
    // If the message was sent by a bot we can just ignore it
    if (message.isBot) return;

    let prefix = parsePrefix(message.guildId);
    const botMention = `<@!${botId}>`;
    const botPhoneMention = `<@${botId}>`;

    // If the message is not using the valid prefix or bot mention cancel the command
    if ([botMention, botPhoneMention].includes(message.content)) {
      return message.reply(parsePrefix(message.guildId));
    } else if (message.content.startsWith(botMention)) prefix = botMention;
    else if (message.content.startsWith(botPhoneMention)) {
      prefix = botPhoneMention;
    } else if (!message.content.startsWith(prefix)) return;

    // Get the first word of the message without the prefix so it is just command name. `!ping testing` becomes `ping`
    const [commandName, ...parameters] = message.content
      .substring(prefix.length)
      .split(" ");

    // Check if this is a valid command
    const command = parseCommand(commandName);
    if (!command) return;

    const guild = cache.guilds.get(message.guildId);
    logCommand(message, guild?.name || "DM", "Trigger", commandName);

    // const lastUsed = bot.slowmode.get(message.author.id);
    // Check if this user is spamming by checking slowmode
    // if (lastUsed && message.timestamp - lastUsed < 2000) {
    //   if (message.guildId) {
    //     await deleteMessage(
    //       message,
    //       translate(message.guildId, "strings:CLEAR_SPAM"),
    //     ).catch(console.log);
    //   }

    //   return logCommand(message, guild?.name || "DM", "Slowmode", commandName);
    // }

    executeCommand(message, command, parameters);
  },
});
