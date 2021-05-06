import { bgBlue, bgYellow, black, bot, Collection } from "../../deps.ts";
import { Task } from "./../types/tasks.ts";
import { getTime } from "./helpers.ts";

export function registerTasks() {
  for (const task of bot.tasks.values()) {
    bot.runningTasks.initialTimeouts.push(setTimeout(async () => {
      console.log(
        `${bgBlue(`[${getTime()}]`)} => [TASK: ${
          bgYellow(black(task.name))
        }] Started.`,
      );
      try {
        await task.execute();
      } catch (error) {
        console.log(error);
      }

      bot.runningTasks.initialTimeouts.push(setInterval(async () => {
        if (!bot.fullyReady) return;
        console.log(
          `${bgBlue(`[${getTime()}]`)} => [TASK: ${
            bgYellow(black(task.name))
          }] Started.`,
        );
        try {
          await task.execute();
        } catch (error) {
          console.log(error);
        }
      }, task.interval));
    }, Date.now() % task.interval));
  }
}

export function clearTasks() {
  for (const timeout of bot.runningTasks.initialTimeouts) clearTimeout(timeout);
  for (const task of bot.runningTasks.intervals) clearInterval(task);

  bot.tasks = new Collection<string, Task>();
  bot.runningTasks = { initialTimeouts: [], intervals: [] };
}
