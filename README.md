# Discordeno Bot Template

This repo is meant as a template which you can use to create a Discord bot very easily using the Discordeno library.

[Discord Server](https://discord.gg/J4NqJ72)

## Pre-requisites

- Deno
- [Velociraptor](https://deno.land/x/velociraptor@v1.0.0-beta.5) *(NOT REQUIRED)* - This can help make coding the bot a lot easier. *Highly recommended*.

## Step By Step

1. Create your own repo using the template button. It is next to the button where you get the url to clone. It will say `Use this template` This is a template repo.
2. Clone your own repo that Github created for you. `git clone url-here-for-your-repo`
3. Create your `configs.ts` file in the main folder.

```ts
export const configs = {
  token: "YOUR_TOKEN_HERE",
  prefix: "!",
  botID: "YOUR_BOT_ID_HERE",
}
```

4. Start the bot `deno run --allow-net --allow-read mod.ts`

**Note:** Having to type all that can be quite annoying everytime you want to start a bot. To make it simpler, this template supports Velociraptor module. Once you install it(link above in pre-requisites) it is as simple as `vr start` or `vr update`(to update) or `vr dev` to both update and start the bot at once.

**Note:** To run the bot with `PM2`: `pm2 start mod.ts --interpreter="deno" --interpreter-args="run --allow-net --allow-read -r" `

The `-r` is short for `--reload`, it reloads your deno cache whenever the bot restarts to get the latest and greatest changes to Discordeno. You don't have to include it.

## Features

- [x] Arguments folder to parse and validate arguments for all your commands.
- [x] Commands to contain all your bots amazing commands.
- [x] Events folder to keep all your events.
- [x] Inhibitors to contain pre-check requirements on commands before running a command
- [x] Monitors to contain functions you want to run on all messages
- [x] Utils to help make developing a Discord bot even easier and faster!
- [x] Embed constructor with character limit checks to prevent errors.
