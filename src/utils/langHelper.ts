import { botCache } from "../../deps.ts";
import { db } from "../database/database.ts";

const loadLanguages = async () => {
    let guilds = await db.guilds.getAll(true).catch(console.log);
    for(const guild of guilds) {
        if (guild[1].language) {
            botCache.guildLanguages.set(guild.id, guild.language);
        }
    }
}

export { loadLanguages }
