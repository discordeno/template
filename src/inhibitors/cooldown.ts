import { botCache } from "../../deps.ts";
import { sendResponse, humanizeMilliseconds } from "../utils/helpers.ts";

const membersInCooldown = new Map<string, Cooldown>();

export interface Cooldown {
  used: number;
  timestamp: number;
}

botCache.inhibitors.set("cooldown", async function (message, command) {
  if (!command.cooldown) return false;

  const key = `${message.author.id}-${command.name}`;
  const cooldown = membersInCooldown.get(key);
  if (cooldown) {
    if (cooldown.used + 1 >= (command.cooldown.allowedUses || 1)) {
      const now = Date.now();
      if (cooldown.timestamp > now) {
        sendResponse(
          message,
          `You must wait **${
            humanizeMilliseconds(cooldown.timestamp - now)
          }** before using this command again.`,
        );
        return true;
      }
    }

    membersInCooldown.set(
      key,
      { used: cooldown.used + 1, timestamp: cooldown.timestamp },
    );
    return false;
  }

  membersInCooldown.set(
    key,
    { used: 1, timestamp: Date.now() + (command.cooldown.seconds * 1000) },
  );
  return false;
});

setInterval(() => {
  const now = Date.now();

  membersInCooldown.forEach((cooldown, key) => {
    if (cooldown.timestamp > now) return;
    membersInCooldown.delete(key);
  });
}, 30000);
