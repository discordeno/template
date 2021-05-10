import { snowflakeToBigint } from "../../deps.ts";
import { db } from "../database/database.ts";
import { bot } from "../../cache.ts";
import { log } from "./logger.ts";

export async function loadLanguages() {
  const guilds = await db.guilds.getAll(true).catch(log.error);

  if (!guilds) return;
  for (const guild of guilds) {
    if (!guild.language) continue;
    bot.guildLanguages.set(snowflakeToBigint(guild.id), guild.language);
  }
}
