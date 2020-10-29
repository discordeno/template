import { botCache, updateEventHandlers } from "../../deps.ts";
import { importDirectory, sendResponse } from "../utils/helpers.ts";
import { PermissionLevels } from "../types/commands.ts";

const folderPaths = new Map(
  [
    ["arguments", "./src/arguments"],
    ["commands", "./src/commands"],
    ["events", "./src/events"],
    ["inhibitors", "./src/inhibitors"],
    ["monitors", "./src/monitors"],
    ["tasks", "./src/tasks"],
    ["perms", "./src/permissionLevels"],
  ],
);

botCache.commands.set(`reload`, {
  name: `reload`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  botChannelPermissions: ["SEND_MESSAGES"],
  arguments: [
    {
      name: "folder",
      type: "string",
      literals: [
        "arguments",
        "commands",
        "events",
        "inhibitors",
        "monitors",
        "tasks",
      ],
      required: false,
    },
  ],
  execute: async function (message, args: ReloadArgs) {
    // Reload a specific folder
    if (args.folder) {
      const path = folderPaths.get(args.folder);
      if (!path) {
        return sendResponse(
          message,
          "The folder you provided did not have a path available.",
        );
      }

      await importDirectory(Deno.realPathSync(path));
      return sendResponse(message, `The **${args.folder}** has been reloaded.`);
    }

    // Reloads the main folders:
    await Promise.all(
      [...folderPaths.values()].map((path) =>
        importDirectory(Deno.realPathSync(path))
      ),
    );
    // Updates the events in the library
    updateEventHandlers(botCache.eventHandlers);

    return sendResponse(message, "Reloaded everything.");
  },
});

interface ReloadArgs {
  folder?: "arguments" | "commands" | "events" | "inhibitors" | "monitors";
}
