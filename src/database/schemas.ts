export interface ClientSchema {
	/** The bot id */
  id: string;
}

export interface GuildSchema {
	/** The guild id */
	id: string;
	/** The custom prefix for this guild */
	prefix: string;
	/** The custom language for this guild */
	language: string;
}

export interface UserSchema {
  /** The user id who created this emoji */
  id: string;
}
