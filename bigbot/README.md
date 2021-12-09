# Discordeno Big Bot Template

Support: https://discord.gg/ddeno

This template is designed for bots that aim or are already in millions of Discord servers.

## Setup

- Use the template generator button to make your own copy.
- Delete all the template folders except the bigbot folder.
- Move all files from the bigbot folder to the root of the project.
  - You may encounter an issue with .vscode but force move the files to the root of the project. We have setup special import maps in this template that should override the general .vscode folder already in the root folder.
- Rename the .env.example file to .env
- Fill out the .env file
- Go to configs.ts file and remove all the intents you don't want in your bot.
- Install `make` if you want to make it easier to use.
  - This may be switched to `deno tasks` when it is available.

## Usage

- Always run the `rest` process first. `make rest`
- Start the `bot` process next. `make bot`
- Lastly, start the `gateway` process. `make gateway`

Note: The `gateway` process and `rest` are designed not to be shut off. So once those are on, the only thing you should be doing is restarting your `bot` process.
