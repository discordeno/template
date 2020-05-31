import Client from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client.ts";
import { configs } from "./configs.ts";
import { Intents } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/options.ts";
import { eventHandlers } from "./src/events/eventHandlers.ts";
import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message.ts";
import { Command } from "./src/types/commands.ts";
import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/guild.ts";

export const botCache = {
  commands: new Map<string, Command>(),
  commandAliases: new Map<string, string>(),
  guildPrefixes: new Map<string, string>(),
  inhibitors: new Map<
    string,
    (message: Message, command: Command, guild?: Guild) => boolean
  >(),
};

const importDirectory = async (path: string) => {
  const files = Deno.readDirSync(Deno.realPathSync(path));

  for (const file of files) {
    if (!file.name) continue;

    const currentPath = `${path}/${file.name}`;
    if (file.isFile) {
      await import(currentPath);
      continue;
    }

    importDirectory(currentPath);
  }
};

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  ["./src/commands", "./src/inhibitors"].map((path) => importDirectory(path)),
);

export const BotOptions = {
  token: configs.token,
  // Replace this with your bot's ID.
  botID: configs.botID,
  // Pick the intents you wish to have for your bot.
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  // These are all your event handler functions. Currently, being imported from a file called eventHandlers from the events folder
  eventHandlers,
};

Client(BotOptions);
