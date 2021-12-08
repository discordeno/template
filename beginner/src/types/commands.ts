import { BotWithCache, DiscordenoInteraction } from "../../deps.ts";

export interface Command {
  /** The name of this command. */
  name: string;
  /** What does this command do? */
  description: string;
  /** Where should this be registered?
   * `Global` (works in all guilds, and DMs) commands can take up to an hour to fully update, while `Guild` commands are registered instantaneously, but have to be registered for each guild. (Defaults to `Both`)
   * @deprecated
   */
  scope?: "Global" | "Guild" | "Both";
  /** This will be executed when the command is run.
   * (And the bot/user has the correct permissions.)
   */
  execute: (bot: BotWithCache, interaction: DiscordenoInteraction) => unknown;
}
