// TODO: change import
import { sendShardMessage } from "https://raw.githubusercontent.com/discordeno/discordeno/main/src/ws/send_shard_message.ts";
import { configs } from "./configs.ts";
import {
  botId,
  Collection,
  DiscordenoMessage,
  Manager,
  Track,
} from "./deps.ts";
import {
  ButtonCollector,
  MessageCollector,
  ReactionCollector,
} from "./src/types/collectors.ts";
import { Argument, Command, PermissionLevels } from "./src/types/commands.ts";
import { CustomEvents } from "./src/types/events.ts";
import { Monitor } from "./src/types/monitors.ts";
import { Task } from "./src/types/tasks.ts";

export const bot = {
  fullyReady: false,
  activeGuildIDs: new Set<bigint>(),
  dispatchedGuildIDs: new Set<bigint>(),
  dispatchedChannelIDs: new Set<bigint>(),
  arguments: new Collection<string, Argument>(),
  commands: new Collection<string, Command<any>>(),
  eventHandlers: {} as CustomEvents,
  guildPrefixes: new Collection<bigint, string>(),
  guildLanguages: new Collection<bigint, string>(),
  messageCollectors: new Collection<bigint, MessageCollector>(),
  reactionCollectors: new Collection<bigint, ReactionCollector>(),
  buttonCollectors: new Collection<bigint, ButtonCollector>(),
  inhibitors: new Collection<
    string,
    (
      message: DiscordenoMessage,
      command: Command<any>
    ) => Promise<boolean> | boolean
  >(),
  monitors: new Collection<string, Monitor>(),
  permissionLevels: new Collection<
    PermissionLevels,
    (
      message: DiscordenoMessage,
      command: Command<any>
    ) => Promise<boolean> | boolean
  >(),
  tasks: new Collection<string, Task>(),
  runningTasks: { initialTimeouts: [] as number[], intervals: [] as number[] },
  memberLastActive: new Collection<bigint, number>(),
  musicQueues: new Collection<bigint, Track[]>(),
  loopingMusics: new Collection<bigint, boolean>(),
  lavadenoManager: new Manager(configs.nodes, {
    userId: botId.toString(),
    send(id, payload) {
      sendShardMessage(Number(id), payload);
    },
  }),
};
