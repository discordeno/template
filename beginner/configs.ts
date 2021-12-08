import { dotEnvConfig } from "./deps.ts";

// Get the .env file that the user should have created, and get the token
dotEnvConfig({ export: true });
const token = Deno.env.get("BOT_TOKEN") || "";

export interface Config {
  token: string;
  botId: bigint;
}

export const configs = {
  /** Get token from ENV variable */
  token,
  /** Get the BotId from the token */
  botId: BigInt(atob(token.split(".")[0])),
};
