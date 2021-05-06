# Discordeno Bot Template

![Log Image](https://i.imgur.com/LHu1DL7.png)

This repo is meant as a template which you can use to create a Discord bot very
easily using the [Discordeno library](https://github.com/discordeno/discordeno).

[Website/Guide:](https://discordeno.mod.land/)

[Discord Server](https://discord.com/invite/5vBgXk3UcZ)

## Pre-requisites

- [Deno](https://deno.land)

## Step By Step

1. Create your own repo using the template button. It is next to the button
   where you get the url to clone. It will say `Use this template` This is a
   template repo.
2. Clone your own repo that Github created for you.
   `git clone url-here-for-your-repo`
3. Create your `configs.ts` file in the main folder.

```ts
// Step 1: If you do NOT use Docker, remove the `.example` from this file name so it is called `configs.ts` or copy the contents of the `configs.example.ts` file into a new `configs.ts` file. Docker will require this file.
// Step 2: Add all your bot's information below. The only required one is token and prefix. NOTE: As long as `.gitignore` file is ignoring configs.ts your configurations will be kept private!
// Step 3: Remove these comments if you like.

export const configs = {
  // Your bot token goes here
  token: "",
  // The default prefix for your bot. Don't worry guilds can change this later.
  prefix: "!",
  // This isn't required but you can add bot list api keys here.
  botListTokens: {
    DISCORD_BOT_ORG: "",
    BOTS_ON_DISCORD: "",
    DISCORD_BOT_LIST: "",
    BOTS_FOR_DISCORD: "",
    DISCORD_BOATS: "",
    DISCORD_BOTS_GG: "",
    DISCORD_BOTS_GROUP: "",
  },
  // This is the server id for your bot's main server where users can get help/support
  supportServerId: "",
  // These are the role ids that will enable some functionality.
  roleIds: {
    // If you have a patreon set up you can add the patreon vip role id here.
    patreonVIPRoleId: "",
  },
  // These are the user ids that will enable some functionality.
  userIds: {
    // You can delete the `as string[]` when you add atleast 1 id in them.
    // The user ids for the support team
    botSupporters: [] as string[],
    // The user ids for the other devs on your team
    botDevs: [] as string[],
    // The user ids who have complete 100% access to your bot
    botOwners: [] as string[],
  },
  webhooks: {
    // the webhook to use when the bot finds a missing translation
    missingTranslation: {
      id: "",
      token: "",
    },
  },
};
```

4. Start the bot `deno run -A --quiet mod.ts`

**Note:** To run the bot with [PM2](https://github.com/Unitech/pm2):
`pm2 start mod.ts --interpreter="deno" --interpreter-args="run -A --quiet -r"`

## Step By Step with Docker

You can also run this image with Docker.

1. Install `docker`
   [Getting started with docker](https://docs.docker.com/get-started/)
2. Clone the repository
3. Create your `configs.ts`
4. Build the container, from the directory containing the repository
   `docker build -t mybot .`
5. Run the container with
   `docker run -v ${PWD}/configs.ts:/bot/configs.ts -t mybot`

**Notes:**

- In the previous commands `${PWD}` and `.` can be replaced with the full path
  to directory
- If you are using Windows OS and want to use `${PWD}` than you need to use
  PowerShell
- You can also use the `-d` argument to run the container in background

### With docker-compose

1. Install `docker`
2. Build the container following the steps (up to the fourth) mentioned above
3. Install `docker-compose`.
   [Getting started with docker-compose](https://docs.docker.com/compose/gettingstarted/)
4. Create a `docker-compose.yml` with this content

```yml
---
version: "3.6"

services:
  app:
    image: mybot:latest # name of the image see docker's step 4 above
    restart: always # restart the bot on failure
    volumes:
      - mybot_database:/bot/db # store database inside a volume so it's persistent
      # bind mount your config with secrets inside the container
      - ./config.ts:/bot/config.ts

# define a volume. You can also bind a path see https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes
volumes:
  mybot_database:
```

5. Start with `docker-compose up -d`
6. Stop with `docker-compose down`

**Notes:**

- I assume that you're running docker-compose from where your `config.ts` is
- You can also remove the `-d` argument to run the container in foreground

## Features

## Beginner Developers

Don't worry a lot of developers start out coding their first projects as a
Discord bot(I did 😉) and it is not so easy. With Discordeno, I tried to build it
in a way that solved all the headaches I had when first starting out coding
bots. If you are a beginner developer, please use this boilerplate.

**Modular commands, arguments, events, inhibitors, monitors, tasks.**

- Clean and powerful commands system
  - Powerful argument handling including validating, parsing and modifications.
  - Easily create custom arguments for your specific needs.
  - Command aliases.
  - Cooldowns and allowed uses before cooldown triggers.
  - Author and bot permission checks in server AND in channel!
- Clean and powerful events system
  - Simple functions that are called when an event occurs.
  - Easily reloadable!
  - No possible memory leaks due to incorrect EventEmitter usage!
  - Useful events available to help debug!
- Clean and powerful inhibitors system
  - Stops a command from running if a requirement fails.
  - Easily add custom inhibitors!
- Clean and powerful monitors system.
  - Runs a function on every message sent. Useful for stuff like auto-moderation
    or tags.
  - Easily ignore bots, users, edits, dms.
  - Powerful permission checks.
- Clean and powerful tasks system.
  - Runs a function at a certain interval. Useful for things like unmute and
    updating bot lists etc.
  - Can be used for cache sweeping to keep your cache optimized for exactly what
    you want.
  - Botlists code already made for most botlists. Just add your api tokens for
    each site and magic!
- Clean and powerful languages system.
  - Built in multi-lingual support.
  - Uses i18next, one of the best localization tools available.
  - Supports nested folders to keep cleaner translation files

**Hot Reloadable**

- Easily update your code without having to restart the bot everytime.

**Step By Step Guide**

- There is a step by step walkthrough to learn how to create Discord bots with
  Discordeno on our website! https://discordeno.mod.land/stepbystep
