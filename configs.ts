import "https://deno.land/x/dotenv/load.ts"; // Load environment variables from .env, making them available via `Deno.env.get("MY_VARIABLE")`

// Step 1: Add all your bot's information below. The only required one is token and prefix.
// Step 2: Create a file called `.env` in your root directory and add your token to it on the format `TOKEN=123123123123123` or `BOT_OWNERS=12121212,3434343434,454545` for a list.
// Step 3: Add any other secret variables to the config file in the same way as in step 2.
// Step 4: Remove these comments if you like.
// Load variables from .env file using the dotenv package. See https://deno.land/x/dotenv

// When deploying or setting up the repo on another machine, the .env file should be created manually
// We don't want to add our .env file and its contents to git

export const configs = {
  // Your bot token goes here
  token: Deno.env.get("TOKEN") || "",
  // The default prefix for your bot. Don't worry guilds can change this later.
  prefix: "!",
  // This isn't required but you can add bot list api keys here.
  botListTokens: {
    DISCORD_BOTS_CO: Deno.env.get("DISCORD_BOTS_CO") || "",
    DISCORD_BOT_ORG: Deno.env.get("DISCORD_BOT_ORG") || "",
    BOTS_ON_DISCORD: Deno.env.get("BOTS_ON_DISCORD") || "",
    DISCORD_BOT_LIST: Deno.env.get("DISCORD_BOT_LIST") || "",
    BOTS_FOR_DISCORD: Deno.env.get("BOTS_FOR_DISCORD") || "",
    DISCORD_BOATS: Deno.env.get("DISCORD_BOATS") || "",
    DISCORD_BOTS_GG: Deno.env.get("DISCORD_BOTS_GG") || "",
    DISCORD_BOTS_GROUP: Deno.env.get("DISCORD_BOTS_GROUP") || "",
  },
  // This is the server id for your bot's main server where users can get help/support
  supportServerID: Deno.env.get("SUPPORT_SERVER") || "",
  // These are channel ids that will enable some functionality
  channelIDs: {
    // When a translation is missing this is the channel you will be alerted in.
    missingTranslation: Deno.env.get("MISSING_TRANSLATION") || "",
    // When an error occurs, we will try and log it to this channel
    errorChannelID: Deno.env.get("ERROR_CHANNEL") || "",
  },
  // These are the role ids that will enable some functionality.
  roleIDs: {
    // If you have a patreon set up you can add the patreon vip role id here.
    patreonVIPRoleID: Deno.env.get("PATREON_VIP_ROLE") || "",
  },
  // These are the user ids that will enable some functionality.
  userIDs: {
    // You can delete the `as string[]` when you add atleast 1 id in them.
    // The user ids for the support team
    botSupporters: Deno.env.get("BOT_SUPPORTERS")?.split(",") ?? [],
    // The user ids for the other devs on your team
    botDevs: Deno.env.get("BOT_DEVS")?.split(",") ?? [],
    // The user ids who have complete 100% access to your bot.
    botOwners: Deno.env.get("BOT_OWNERS")?.split(",") ?? [],
  },
};
