import { bot } from "../../cache.ts";
import {
  botId,
  cache,
  delay,
  getChannels,
  getGuild,
  getMember,
  Guild,
  snowflakeToBigint,
  structures,
} from "../../deps.ts";

const processing = new Set<bigint>();

bot.eventHandlers.dispatchRequirements = async function (data, shardID) {
  if (!bot.fullyReady) return;

  // DELETE MEANS WE DONT NEED TO FETCH. CREATE SHOULD HAVE DATA TO CACHE
  if (data.t && ["GUILD_CREATE", "GUILD_DELETE"].includes(data.t)) return;

  const id = snowflakeToBigint(
    (data.t && ["GUILD_UPDATE"].includes(data.t)
      ? // deno-lint-ignore no-explicit-any
        (data.d as any)?.id
      : // deno-lint-ignore no-explicit-any
        (data.d as any)?.guild_id) ?? "",
  );

  if (!id || bot.activeGuildIDs.has(id)) return;

  // If this guild is in cache, it has not been swept and we can cancel
  if (cache.guilds.has(id)) {
    bot.activeGuildIDs.add(id);
    return;
  }

  if (processing.has(id)) {
    console.log(
      `[DISPATCH] New Guild ID already being processed: ${id} in ${data.t} event`,
    );

    let runs = 0;
    do {
      await delay(500);
      ++runs;
    } while (processing.has(id) && runs < 40);

    if (!processing.has(id)) return;

    return console.log(
      `[DISPATCH] Already processed guild was not successfully fetched:  ${id} in ${data.t} event`,
    );
  }

  processing.add(id);

  // New guild id has appeared, fetch all relevant data
  console.log(`[DISPATCH] New Guild ID has appeared: ${id} in ${data.t} event`);

  const rawGuild = (await getGuild(id, {
    counts: true,
    addToCache: false,
  }).catch(console.log)) as Guild | undefined;

  if (!rawGuild) {
    processing.delete(id);
    return console.log(`[DISPATCH] Guild ID ${id} failed to fetch.`);
  }

  console.log(`[DISPATCH] Guild ID ${id} has been found. ${rawGuild.name}`);

  const [channels, botMember] = await Promise.all([
    getChannels(id, false),
    getMember(id, botId, { force: true }),
  ]).catch((error) => {
    console.log(error);
    return [];
  });

  if (!botMember || !channels) {
    processing.delete(id);
    return console.log(
      `[DISPATCH] Guild ID ${id} Name: ${rawGuild.name} failed. Unable to get botMember or channels`,
    );
  }

  const guild = await structures.createDiscordenoGuild(rawGuild, shardID);

  // Add to cache
  cache.guilds.set(id, guild);
  bot.dispatchedGuildIDs.delete(id);
  channels.forEach((channel) => {
    bot.dispatchedChannelIDs.delete(channel.id);
    cache.channels.set(channel.id, channel);
  });

  processing.delete(id);

  console.log(
    `[DISPATCH] Guild ID ${id} Name: ${guild.name} completely loaded.`,
  );
};

// Events that have
/**
 * channelCreate
 * channelUpdate
 * channelDelete
 * channelPinsUpdate
 * guildBanAdd
 * guildBanRemove
 * guildEmojisUpdate
 * guildIntegrationsUpdate
 * guildMemberAdd
 * guildMemberRemove
 * guildMemberUpdate
 * guildMembersChunk
 * guildRoleCreate
 * guildRoleUpdate
 * guildRoleDelete
 * inviteCreate
 * inviteDelete
 * messageCreate
 * messageUpdate
 * messageDelete
 * messageDeleteBulk
 * messageReactionAdd
 * messageReactionRemove
 * messageReactionRemoveAll
 * messageReactionRemoveEmoji
 * presenceUpdate
 * typingStart
 * voiceStateUpdate
 * voiceServerUpdate
 * webhooksUpdate
 */

// Events that dont have guild_id
/**
 * guildCreate id
 * guildUpdate id
 * guildDelete id
 */

export function sweepInactiveGuildsCache() {
  for (const guild of cache.guilds.values()) {
    if (bot.activeGuildIDs.has(guild.id)) continue;

    // This is inactive guild. Not a single thing has happened for atleast 30 minutes.
    // Not a reaction, not a message, not any event!
    cache.guilds.delete(guild.id);
    bot.dispatchedGuildIDs.add(guild.id);
  }

  // Remove all channel if they were dispatched
  cache.channels.forEach((channel) => {
    if (!bot.dispatchedGuildIDs.has(channel.guildId)) return;

    cache.channels.delete(channel.id);
    bot.dispatchedChannelIDs.add(channel.id);
  });

  // Reset activity for next interval
  bot.activeGuildIDs.clear();
}
