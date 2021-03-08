# Discordeno Bot Template

This repo is meant as a template which you can use to create a Discord bot very
easily using the [Discordeno library](https://github.com/discordeno/discordeno).

[Website/Guide:](https://discordeno.mod.land/)

[Discord Server](https://discord.com/invite/5vBgXk3UcZ)

## Pre-requisites

- [Deno](https://deno.land)

## First steps, setting up the project

1. Create your own repo using the template button. It is next to the button
   where you get the url to clone. It will say `Use this template` This is a
   template repo.
2. Clone that new repo that Github created for you.
   `git clone url-here-for-your-repo`
3. Create an `.env` file in your root directory
4. Add your bot's token to `.env` file like so:
   ```
   TOKEN=123123123
   ```
   _The token will get loaded into the application from the `configs.ts` file_
5. Proceed with one of the step-by-step instructions below. Whichever suits your
   taste.

## Step By Step

After setting up the project:

1. Start the bot `deno run -A --quiet --import-map=./import-map.json mod.ts`

**Note:** To run the bot with [PM2](https://github.com/Unitech/pm2):
`pm2 start mod.ts --interpreter="deno" --interpreter-args="run --allow-read --allow-write --allow-net --allow-env --import-map=./import-map.json"`

## Step By Step using Docker

After setting up the project:

1. Build the container, from the root of your project with the command
   `docker build -t mybot .`
2. Run the container `docker run --env-file .env -t mybot`

## Step By Step using Docker Compose

After setting up the project:

1. Install `docker`
   [Getting started with docker](https://docs.docker.com/get-started/)
2. Install `docker compose`
   [Install Docker Compose](https://docs.docker.com/compose/install/)
3. Start your container with `docker-compose up -d`
4. Stop your container with `docker-compose down`

## Configuring your project

You will most likely want to configure your project by adding discord channel
ids and user ids. This is done by adding variables to the `.env` file and
updating the `configs.ts` file accordingly.

## Hot reloading

1. add `--watch` to your start command. I.e
   `deno run -A --watch --import-map=./import-map.json mod.ts`
2. Enjoy hot reloading anytime you save a file. 🔥

## Beginner Developers

Don't worry, a lot of developers start out coding their first projects as a
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
