import { botCache, Collection } from "../../deps.ts";
import { Task } from "./../types/tasks.ts";

const registerTasks = () => {
  for (const task of botCache.tasks.values()) {
    botCache.runningTasks.push(
      setInterval(() => task.execute(), task.interval)
    );
  }
};

const clearTasks = () => {
  for (const task of botCache.runningTasks) {
    clearInterval(task);
  }
  botCache.tasks = new Collection<string, Task>();
  botCache.runningTasks = [];
};

export { registerTasks, clearTasks };
