import i18next from "https://deno.land/x/i18next@v20.2.2/index.js";
import Backend from "https://deno.land/x/i18next_fs_backend@v1.1.1/index.js";
import { configs } from "../../configs.ts";
import { cache, sendWebhook, snowflakeToBigint } from "../../deps.ts";
import { bot } from "../../cache.ts";

/** This function helps translate the string to the specific guilds needs. */
export function translate(guildId: bigint, key: string, options?: unknown) {
  const guild = cache.guilds.get(guildId);
  const language = bot.guildLanguages.get(guildId) || guild?.preferredLocale ||
    "en_US";

  // undefined is silly bug cause i18next dont have proper typings
  const languageMap = i18next.getFixedT(language, undefined) ||
    i18next.getFixedT("en_US", undefined);

  return languageMap(key, options);
}

export async function determineNamespaces(
  path: string,
  namespaces: string[] = [],
  folderName = "",
) {
  const files = Deno.readDirSync(Deno.realPathSync(path));

  for (const file of files) {
    if (file.isDirectory) {
      const isLanguage = file.name.includes("-") || file.name.includes("_");

      namespaces = await determineNamespaces(
        `${path}/${file.name}`,
        namespaces,
        isLanguage ? "" : `${folderName + file.name}/`,
      );
    } else {
      namespaces.push(
        `${folderName}${file.name.substr(0, file.name.length - 5)}`,
      );
    }
  }

  return [...new Set(namespaces)];
}

export async function loadLanguages() {
  const namespaces = await determineNamespaces(
    Deno.realPathSync("./src/languages"),
  );
  const languageFolder = [
    ...Deno.readDirSync(Deno.realPathSync("./src/languages")),
  ];

  return i18next.use(Backend).init(
    {
      initImmediate: false,
      fallbackLng: "en_US",
      interpolation: { escapeValue: false },
      load: "all",
      lng: "en_US",
      saveMissing: true,
      // Log to discord/console that a string is missing somewhere.
      missingKeyHandler: async function (
        lng: string,
        ns: string,
        key: string,
        fallbackValue: string,
      ) {
        const response =
          `Missing translation key: ${lng}/${ns}:${key}. Instead using: ${fallbackValue}`;
        console.warn(response);

        if (!configs.webhooks.missingTranslation.id) return;

        await sendWebhook(
          snowflakeToBigint(configs.webhooks.missingTranslation.id),
          configs.webhooks.missingTranslation.token,
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          { content: response },
        ).catch(console.error);
      },
      preload: languageFolder
        .map((file) => (file.isDirectory ? file.name : undefined))
        // Removes any non directory names(language names)
        .filter((name) => name),
      ns: namespaces,
      backend: {
        loadPath: `${Deno.realPathSync("./src/languages")}/{{lng}}/{{ns}}.json`,
      },
      // Silly bug in i18next needs a second param when unnecessary
    },
    undefined,
  );
}

export async function reloadLang(language?: string[]) {
  const namespaces = await determineNamespaces(
    Deno.realPathSync("./src/languages"),
  );

  i18next.reloadResources(language, namespaces, undefined);
}
