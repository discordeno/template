import { bot } from "../../deps.ts";
import { db } from "../database/database.ts";

export async function loadLanguages() {
  const guilds = await db.guilds.getAll(true).catch(console.error);

  if (!guilds) return;
  for (const guild of guilds) {
    if (!guild.language) continue;
    bot.guildLanguages.set(guild.id, guild.language);
  }
}
