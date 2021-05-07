import { snakelize, VoiceServerUpdate, VoiceState } from "../../deps.ts";
import { bot } from "../../cache.ts";

bot.eventHandlers.raw = function (data) {
  if (data.t === "VOICE_SERVER_UPDATE") {
    bot.lavadenoManager.serverUpdate(snakelize(data.d as VoiceServerUpdate));
  } else if (data.t === "VOICE_STATE_UPDATE") {
    bot.lavadenoManager.stateUpdate(snakelize(data.d as VoiceState));
  }
};
