import { bot } from "../../cache.ts";
import {
  cache,
  Collection,
  deleteMessage,
  deleteMessages,
  DiscordButtonStyles,
  DiscordenoMessage,
  DiscordMessageComponentTypes,
  editMessage,
  editWebhookMessage,
  Emoji,
  fetchMembers,
  getMember,
  MessageComponents,
  removeReaction,
  sendInteractionResponse,
  sendMessage,
  snowflakeToBigint,
  ws,
} from "../../deps.ts";
import { ArgumentDefinition, Command } from "../types/commands.ts";
import { needButton, needMessage, needReaction } from "./collectors.ts";
import { Milliseconds } from "./constants/time.ts";
import { Embed } from "./Embed.ts";

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function humanizeMilliseconds(milliseconds: number) {
  // Gets ms into seconds
  const time = milliseconds / 1000;
  if (time < 1) return "1s";

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor(((time % 86400) % 3600) / 60);
  const seconds = Math.floor(((time % 86400) % 3600) % 60);

  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return `${dayString}${hourString}${minuteString}${secondString}`;
}

/** This function helps convert a string like 1d5h to milliseconds. */
export function stringToMilliseconds(text: string) {
  const matches = text.match(/(\d+[w|d|h|m|s]{1})/g);
  if (!matches) return;

  let total = 0;

  for (const match of matches) {
    // Finds the first of these letters
    const validMatch = /(w|d|h|m|s)/.exec(match);
    // if none of them were found cancel
    if (!validMatch) return;
    // Get the number which should be before the index of that match
    const number = match.substring(0, validMatch.index);
    // Get the letter that was found
    const [letter] = validMatch;
    if (!number || !letter) return;

    let multiplier = Milliseconds.SECOND;
    switch (letter.toLowerCase()) {
      case `w`:
        multiplier = Milliseconds.WEEK;
        break;
      case `d`:
        multiplier = Milliseconds.DAY;
        break;
      case `h`:
        multiplier = Milliseconds.HOUR;
        break;
      case `m`:
        multiplier = Milliseconds.MINUTE;
        break;
    }

    const amount = number ? parseInt(number, 10) : undefined;
    if (!amount) return;

    total += amount * multiplier;
  }

  return total;
}

export function createCommand<T extends readonly ArgumentDefinition[]>(
  command: Command<T>,
) {
  (command.botChannelPermissions = [
    "ADD_REACTIONS",
    "USE_EXTERNAL_EMOJIS",
    "READ_MESSAGE_HISTORY",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "EMBED_LINKS",
    ...(command.botChannelPermissions ?? []),
  ]), bot.commands.set(command.name, command);
}

export function createSubcommand<T extends readonly ArgumentDefinition[]>(
  commandName: string,
  subcommand: Command<T>,
  retries = 0,
) {
  const names = commandName.split("-");

  let command: Command<T> = bot.commands.get(commandName)!;

  if (names.length > 1) {
    for (const name of names) {
      const validCommand = command
        ? command.subcommands?.get(name)
        : bot.commands.get(name);

      if (!validCommand) {
        if (retries === 20) break;
        setTimeout(
          () => createSubcommand(commandName, subcommand, retries++),
          Milliseconds.SECOND * 10,
        );
        return;
      }

      command = validCommand;
    }
  }

  if (!command) {
    // If 10 minutes have passed something must have been wrong
    if (retries === 20) {
      return console.log(
        `Subcommand ${subcommand} unable to be created for ${commandName}`,
      );
    }

    // Try again in 10 seconds in case this command file just has not been loaded yet.
    setTimeout(
      () => createSubcommand(commandName, subcommand, retries++),
      Milliseconds.SECOND * 10,
    );
    return;
  }

  if (!command.subcommands) {
    command.subcommands = new Collection();
  }

  // console.log("Creating subcommand", command.name, subcommand.name);
  command.subcommands.set(subcommand.name, subcommand);
}

// export function createSubcommand(
//   commandName: string,
//   subcommand: Command,
//   retries = 0,
// ) {
//   const names = commandName.split("-");

//   let command = bot.commands.get(commandName);

//   if (names.length > 1) {
//     for (const name of names) {
//       const validCommand = command
//         ? command.subcommands?.get(name)
//         : bot.commands.get(name);
//       if (!validCommand) break;

//       command = validCommand;
//     }
//   }

//   if (!command) {
//     // If 10 minutes have passed something must have been wrong
//     if (retries === 600) {
//       return console.error(
//         `Subcommand ${subcommand} unable to be created for ${commandName}`,
//       );
//     }

//     // Try again in 3 seconds in case this command file just has not been loaded yet.
//     setTimeout(
//       () => createSubcommand(commandName, subcommand, retries++),
//       1000,
//     );
//     return;
//   }

//   if (!command.subcommands) {
//     command.subcommands = new Collection();
//   }

//   command.subcommands.set(subcommand.name, subcommand);
// }

/** Use this function to send an embed with ease. */
export function sendEmbed(channelId: bigint, embed: Embed, content?: string) {
  return sendMessage(channelId, { content, embed });
}

/** Use this function to edit an embed with ease. */
export function editEmbed(
  message: DiscordenoMessage,
  embed: Embed,
  content?: string,
) {
  return editMessage(message, { content, embed });
}

// Very important to make sure files are reloaded properly
let uniqueFilePathCounter = 0;
let paths: string[] = [];

/** This function allows reading all files in a folder. Useful for loading/reloading commands, monitors etc */
export async function importDirectory(path: string) {
  path = path.replaceAll("\\", "/");
  const files = Deno.readDirSync(Deno.realPathSync(path));
  const folder = path.substring(path.indexOf("/src/") + 5);

  if (!folder.includes("/")) console.log(`Loading ${folder}...`);

  for (const file of files) {
    if (!file.name) continue;

    const currentPath = `${path}/${file.name}`;
    if (file.isFile) {
      if (!currentPath.endsWith(".ts")) continue;
      paths.push(
        `import "${
          Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/"))
        }/${
          currentPath.substring(
            currentPath.indexOf("src/"),
          )
        }#${uniqueFilePathCounter}";`,
      );
      continue;
    }

    await importDirectory(currentPath);
  }

  uniqueFilePathCounter++;
}

/** Imports all everything in fileloader.ts */
export async function fileLoader() {
  await Deno.writeTextFile(
    "fileloader.ts",
    paths.join("\n").replaceAll("\\", "/"),
  );
  await import(
    `${
      Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/"))
    }/fileloader.ts#${uniqueFilePathCounter}`
  );
  paths = [];
}

export function getTime() {
  const now = new Date();
  const hours = now.getHours();
  const minute = now.getMinutes();

  let hour = hours;
  let amOrPm = `AM`;
  if (hour > 12) {
    amOrPm = `PM`;
    hour = hour - 12;
  }

  return `${hour >= 10 ? hour : `0${hour}`}:${
    minute >= 10 ? minute : `0${minute}`
  } ${amOrPm}`;
}

export function getCurrentLanguage(guildId: bigint) {
  return bot.guildLanguages.get(guildId) ||
    cache.guilds.get(guildId)?.preferredLocale || "en_US";
}

/** This function allows to create a pagination using embeds and reactions Requires GUILD_MESSAGE_REACTIONS intent **/
export async function createEmbedsPagination(
  channelId: bigint,
  authorId: bigint,
  embeds: Embed[],
  defaultPage = 1,
  reactionTimeout = Milliseconds.SECOND * 30,
  reactions: {
    [emoji: string]: (
      setPage: (newPage: number) => void,
      currentPage: number,
      pageCount: number,
      deletePagination: () => void,
    ) => Promise<unknown>;
  } = {
    // deno-lint-ignore require-await
    "◀️": async (setPage, currentPage) => setPage(Math.max(currentPage - 1, 1)),
    "↗️": async (setPage) => {
      const question = await sendMessage(
        channelId,
        "To what page would you like to jump? Say `cancel` or `0` to cancel the prompt.",
      );
      const answer = await needMessage(authorId, channelId);
      await deleteMessages(channelId, [question.id, answer.id]).catch(
        console.log,
      );

      const newPageNumber = Math.ceil(Number(answer.content));

      if (isNaN(newPageNumber)) {
        return await sendMessage(channelId, "This is not a valid number!");
      }

      if (newPageNumber < 1 || newPageNumber > embeds.length) {
        return await sendMessage(channelId, `This is not a valid page!`);
      }

      setPage(newPageNumber);
    },
    // deno-lint-ignore require-await
    "▶️": async (setPage, currentPage, pageCount) =>
      setPage(Math.min(currentPage + 1, pageCount)),
    // deno-lint-ignore require-await
    "🗑️": async (_setPage, _currentPage, _pageCount, deletePagination) =>
      deletePagination(),
  },
) {
  if (embeds.length === 0) return;

  let currentPage = defaultPage;
  const embedMessage = await sendEmbed(channelId, embeds[currentPage - 1]);

  if (!embedMessage) return;

  if (embeds.length <= 1) return;

  await embedMessage.addReactions(Object.keys(reactions), true).catch(
    console.log,
  );

  let isEnded = false;

  while (!isEnded) {
    if (!embedMessage) return;

    const reaction = await needReaction(authorId, embedMessage.id, {
      duration: reactionTimeout,
    });
    if (!reaction) return;

    if (embedMessage.guildId) {
      await removeReaction(embedMessage.channelId, embedMessage.id, reaction, {
        userId: authorId,
      }).catch(console.log);
    }

    if (reactions[reaction]) {
      await reactions[reaction](
        (newPage) => {
          currentPage = newPage;
        },
        currentPage,
        embeds.length,
        async () => {
          isEnded = true;
          await embedMessage.delete().catch(console.log);
        },
      );
    }

    if (
      isEnded || !embedMessage ||
      !(await editEmbed(embedMessage, embeds[currentPage - 1]).catch(
        console.log,
      ))
    ) {
      return;
    }
  }
}

/** This function allows to create a pagination using embeds and buttons. **/
export async function createEmbedsButtonsPagination(
  messageId: bigint,
  channelId: bigint,
  authorId: bigint,
  embeds: Embed[],
  defaultPage = 1,
  buttonTimeout = Milliseconds.SECOND * 30,
) {
  if (embeds.length === 0) return;

  let currentPage = defaultPage;

  const createComponents = (): MessageComponents => [
    {
      type: DiscordMessageComponentTypes.ActionRow,
      components: [
        {
          type: DiscordMessageComponentTypes.Button,
          label: "Previous",
          customId: `${messageId}-Previous`,
          style: DiscordButtonStyles.Primary,
          disabled: currentPage === 1,
          emoji: { name: "⬅️" },
        },
        {
          type: DiscordMessageComponentTypes.Button,
          label: "Jump",
          customId: `${messageId}-Jump`,
          style: DiscordButtonStyles.Primary,
          disabled: embeds.length <= 2,
          emoji: { name: "↗️" },
        },
        {
          type: DiscordMessageComponentTypes.Button,
          label: "Next",
          customId: `${messageId}-Next`,
          style: DiscordButtonStyles.Primary,
          disabled: currentPage >= embeds.length,
          emoji: { name: "➡️" },
        },
        {
          type: DiscordMessageComponentTypes.Button,
          label: "Delete",
          customId: `${messageId}-Delete`,
          style: DiscordButtonStyles.Danger,
          emoji: { name: "🗑️" },
        },
      ],
    },
  ];

  const embedMessage = await sendMessage(channelId, {
    embed: embeds[currentPage - 1],
    components: createComponents(),
  });

  if (!embedMessage) return;

  if (embeds.length <= 1) return;

  let isEnded = false;

  while (!isEnded) {
    if (!embedMessage) {
      isEnded = true;
      break;
    }

    const collectedButton = await needButton(authorId, embedMessage.channelId, {
      duration: buttonTimeout,
    });

    console.log(collectedButton);

    if (
      !collectedButton ||
      !collectedButton.customId.startsWith(messageId.toString())
    ) {
      return;
    }

    const action = collectedButton.customId.split("-")[1];

    switch (action) {
      case "Next":
        currentPage += 1;
        break;
      // deno-lint-ignore no-case-declarations
      case "Jump":
        await sendInteractionResponse(
          snowflakeToBigint(collectedButton.interaction.id),
          collectedButton.interaction.token,
          {
            type: 6,
          },
        );

        const question = await sendMessage(
          channelId,
          "To what page would you like to jump? Say `cancel` or `0` to cancel the prompt.",
        );
        const answer = await needMessage(authorId, channelId);
        await deleteMessages(channelId, [question.id, answer.id]).catch(
          console.log,
        );

        const newPageNumber = Math.ceil(Number(answer.content));

        if (
          isNaN(newPageNumber) || newPageNumber < 1 ||
          newPageNumber > embeds.length
        ) {
          await sendMessage(channelId, "This is not a valid number!");
          continue;
        }

        currentPage = newPageNumber;

        editWebhookMessage(
          snowflakeToBigint(collectedButton.interaction.applicationId),
          collectedButton.interaction.token,
          {
            messageId: embedMessage.id,
            embeds: [embeds[currentPage - 1]],
            components: createComponents(),
          },
        );

        continue;
      case "Previous":
        currentPage -= 1;
        break;
      case "Delete":
        deleteMessage(channelId, embedMessage.id);
        isEnded = true;
        break;
    }

    if (
      isEnded ||
      !embedMessage ||
      !(await sendInteractionResponse(
        snowflakeToBigint(collectedButton.interaction.id),
        collectedButton.interaction.token,
        {
          type: 7,
          data: {
            embeds: [embeds[currentPage - 1]],
            components: createComponents(),
          },
        },
      ).catch(console.log))
    ) {
      return;
    }
  }
}

export function emojiUnicode(emoji: Emoji) {
  return emoji.animated || emoji.id
    ? `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`
    : emoji.name || "";
}

export async function fetchMember(guildId: bigint, id: bigint | string) {
  const userId = typeof id === "string"
    ? id.startsWith("<@")
      ? BigInt(id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1))
      : BigInt(id)
    : id;

  const guild = cache.guilds.get(guildId);
  if (!guild) return;

  const cachedMember = cache.members.get(userId);
  if (cachedMember) return cachedMember;

  const shardId = calculateShardId(guildId);

  const shard = ws.shards.get(shardId);
  // When gateway is dying
  if (shard?.queueCounter && shard.queueCounter > 110) {
    return getMember(guildId, userId).catch(() => undefined);
  }

  // Fetch from gateway as it is much better than wasting limited HTTP calls.
  const member = await fetchMembers(guildId, shardId, {
    userIds: [userId],
    limit: 1,
  }).catch(() => undefined);

  return member?.first();
}

export function calculateShardId(guildId: bigint) {
  return Number((guildId >> 22n) % BigInt(ws.maxShards - 1));
}
