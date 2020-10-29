import { botCache, cache } from "../../deps.ts";
import { sendResponse } from "../utils/helpers.ts";

botCache.arguments.set("role", {
  name: "role",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    const roleID = id.startsWith("<@&") ? id.substring(3, id.length - 1) : id;

    const name = id.toLowerCase();
    const role = guild.roles.get(roleID) ||
      guild.roles.find((r) => r.name.toLowerCase() === name);
    if (role) return role;

    // No role was found, let's list roles for better user experience.
    const possibleRoles = guild.roles.filter((r) =>
      r.name.toLowerCase().startsWith(name)
    );
    if (!possibleRoles) return;

    sendResponse(
      message,
      [
        `A valid role was not found using the name **${id}**.`,
        "A few possible roles that you may wish to use were found. Listed below are the role names and ids. Try using the id of the role you wish to use.",
        "",
        possibleRoles.map((r) => `**${r.name}** ${r.id}`).join("\n"),
      ].join("\n"),
    );
  },
});
