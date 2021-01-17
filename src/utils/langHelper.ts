import { botCache } from "../../deps.ts";
import { db } from "../database/database.ts";

export async function loadLanguages() {
    let guilds = await db.guilds.getAll(true);

    for(const guild of guilds) {
        if (guild.language) {
            botCache.guildLanguages.set(guild.id, guild.language);
        }
    }
}