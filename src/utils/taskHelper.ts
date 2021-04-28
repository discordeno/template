import { bot, Collection } from "../../deps.ts";
import { Task } from "./../types/tasks.ts";

const registerTasks = () => {
  for (const task of bot.tasks.values()) {
    bot.runningTasks.push(
      setInterval(() => task.execute(), task.interval),
    );
  }
};

const clearTasks = () => {
  for (const task of bot.runningTasks) {
    clearInterval(task);
  }
  bot.tasks = new Collection<string, Task>();
  bot.runningTasks = [];
};

export { clearTasks, registerTasks };
