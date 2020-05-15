// This command is intentionally different from other commands to show that they can also be done this way.
// This is the ideal way because it will give you automated typings.
import { botCache } from "../../mod.ts";

botCache.commands.set(`avatar`, {
  callback: (message, _args, guild) => {
    const user = message.mentions.length ? message.mentions[0] : message.author;

    return message.channel.sendMessage({
      embed: {
        author: {
          name: user.tag,
          icon_url: user.avatarURL(),
        },
        image: {
          url: user.avatarURL(2048),
        },
      },
    });
  },
});
