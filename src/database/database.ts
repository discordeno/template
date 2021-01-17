import { Sabr, SabrTable } from "../../deps.ts";
import {
  ClientSchema,
  GuildSchema,
  UserSchema,
} from "./schemas.ts";
import { loadLanguages } from "./../utils/langHelper.ts";

// Create the database class
const sabr = new Sabr();

export const db = {
  // This will allow us to access table methods easily as we will see below.
  sabr,
  client: new SabrTable<ClientSchema>(sabr, "client"),
  guilds: new SabrTable<GuildSchema>(sabr, "guilds"),
  users: new SabrTable<UserSchema>(sabr, "users"),
};

// This is important as it prepares all the tables.
await sabr.init();

loadLanguages();
