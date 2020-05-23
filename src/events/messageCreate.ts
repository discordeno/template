import { Message } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v4/structures/message.ts";
import { commandHandler } from "../monitors/commandHandler.ts";

export const messageCreate = (message: Message) => {
  commandHandler(message);
};
