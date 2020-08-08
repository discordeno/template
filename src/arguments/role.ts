import { botCache } from "../../mod.ts";

botCache.arguments.set("role", {
  name: "role",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = message.guild();
    if (!guild) return;

    const roleID = id.startsWith("<@&")
      ? id.substring(3, id.length - 1)
      : id;

		const name = id.toLowerCase()
    const role = guild.roles.get(roleID) || guild.roles.find(r => r.name.toLowerCase() === name);
		return role;
  },
});
