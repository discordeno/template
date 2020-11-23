import { botCache, Collection } from "../../deps.ts";
import { Task } from "./../types/tasks.ts";

let runningTasksList: Array<number> = [];

const registerTasks = () => {
  for (const task of botCache.tasks.values()) {
    runningTasksList.push(setInterval(() => task.execute(), task.interval));
  }
};

const clearTasks = () => {
  for (const task of runningTasksList) {
    clearInterval(task);
  }
  botCache.tasks = new Collection<string, Task>();
  runningTasksList = [];
};

export { registerTasks, clearTasks };
