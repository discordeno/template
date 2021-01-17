import { botCache } from "../../deps.ts";
import { db } from "../database/database.ts";

const loadLanguages = async () => {
    let guilds = await db.guilds.getAll();
    for(const guild of guilds) {
        if (guild[1].language) {
            botCache.guildLanguages.set(guild[1].id, guild[1].language);
        }
    }
}

export { loadLanguages }