import ar from "./translations/ar.json";
import ca from "./translations/ca.json";
import de from "./translations/de.json";
import en from "./translations/en.json";
import es from "./translations/es.json";
import fr from "./translations/fr.json";
import hi from "./translations/hi.json";
import ja from "./translations/ja.json";
import nl from "./translations/nl.json";
import pt from "./translations/pt.json";
import ru from "./translations/ru.json";
import tr from "./translations/tr.json";
import uk from "./translations/uk.json";
import zh from "./translations/zh.json";

export type Messages = { [key: string]: string | Messages };

export type Language = {
  id: string;
  label: string;
};

export const defaultLanguage = "en";

export const availableLanguages: Language[] = [
  { id: "ar", label: "العربية" },
  { id: "ca", label: "Català" },
  { id: "de", label: "Deutsch" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "hi", label: "हिन्दी" },
  { id: "ja", label: "日本語" },
  { id: "nl", label: "Nederlands" },
  { id: "pt", label: "Português" },
  { id: "ru", label: "Русский" },
  { id: "tr", label: "Türkçe" },
  { id: "uk", label: "Українська" },
  { id: "zh", label: "中文" },
];

const missingValues = new Set(["__missing__", "__fallback__"]);

/** Drops untranslated placeholders so lookups fall through to English. */
const stripMissing = (messages: Messages): Messages => {
  const result: Messages = {};
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === "object") {
      result[key] = stripMissing(value);
    } else if (!missingValues.has(value)) {
      result[key] = value;
    }
  }
  return result;
};

export const messages: Record<string, Messages> = {
  ar: stripMissing(ar),
  ca: stripMissing(ca),
  de: stripMissing(de),
  en: stripMissing(en),
  es: stripMissing(es),
  fr: stripMissing(fr),
  hi: stripMissing(hi),
  ja: stripMissing(ja),
  nl: stripMissing(nl),
  pt: stripMissing(pt),
  ru: stripMissing(ru),
  tr: stripMissing(tr),
  uk: stripMissing(uk),
  zh: stripMissing(zh),
};

export const isLanguage = (lang: string | null | undefined): lang is string =>
  !!lang && availableLanguages.some((l) => l.id === lang);

const lookup = (source: Messages | undefined, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Messages)[part];
    }
    return undefined;
  }, source);

export type TranslationParams = Record<string, string | number>;

export function translate(
  lang: string,
  key: string,
  params?: TranslationParams,
): string {
  const localized = lookup(messages[lang], key);
  const fallback =
    localized === undefined
      ? lookup(messages[defaultLanguage], key)
      : localized;
  if (typeof fallback !== "string") return key;
  if (!params) return fallback;
  return fallback.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}
