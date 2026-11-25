import { filesize } from "filesize";
import {
  formatDistanceToNow,
  formatDuration as formatDateFnsDuration,
  type Duration,
  type Locale,
} from "date-fns";
import { ar } from "date-fns/locale/ar";
import { de } from "date-fns/locale/de";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";
import { fr } from "date-fns/locale/fr";
import { hi } from "date-fns/locale/hi";
import { ja } from "date-fns/locale/ja";
import { nl } from "date-fns/locale/nl";
import { pt } from "date-fns/locale/pt";
import { ru } from "date-fns/locale/ru";
import { tr } from "date-fns/locale/tr";
import { uk } from "date-fns/locale/uk";
import { zhCN } from "date-fns/locale/zh-CN";

export type DateType = Date | string | number;

const dateLocales: Record<string, Locale> = {
  ar,
  de,
  en: enUS,
  es,
  fr,
  hi,
  ja,
  nl,
  pt,
  ru,
  tr,
  uk,
  zh: zhCN,
};

export const resolveDateLocale = (lang: string): Locale =>
  dateLocales[lang] ?? enUS;

/**
 * Cached number formatters: `new Intl.NumberFormat` is expensive, and table
 * re-renders format dozens of values per keystroke/toggle.
 */
const numberFormatters = new Map();
const numberFormatter = (lang: string) => {
  let formatter = numberFormatters.get(lang);
  if (!formatter) {
    formatter = new Intl.NumberFormat(lang);
    if (numberFormatters.size > 32) numberFormatters.clear();
    numberFormatters.set(lang, formatter);
  }
  return formatter;
};

// Mirrors filesize@10's symbol tables (the parts this app uses).
const filesizeSymbols = {
  iec: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
  jedec: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
};

/**
 * Formats bytes with localized units, matching `filesize(value, { locale,
 * base })` output but with a cached `Intl.NumberFormat` (filesize calls
 * `toLocaleString` per invocation, which rebuilds a formatter every time).
 */
export const formatFilesize = (
  value: number,
  lang: string,
  base: 2 | 10 = 2,
) => {
  const num = Number(value);
  if (Number.isNaN(num)) return filesize(value, { locale: lang, base });

  const ceil = base === 2 ? 1024 : 1000;
  const standard = base === 2 ? "iec" : "jedec";
  const neg = num < 0;
  const abs = neg ? -num : num;

  let e = Math.floor(Math.log(abs) / Math.log(ceil));
  if (e < 0) e = 0;
  if (e > 8) e = 8;

  let number, unit;
  if (abs === 0) {
    number = 0;
    unit = filesizeSymbols[standard][e];
  } else {
    let val = abs / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));
    const p = Math.pow(10, e > 0 ? 2 : 0);
    number = Math.round(val * p) / p;
    if (number === ceil && e < 8) {
      number = 1;
      e++;
    }
    unit = base === 10 && e === 1 ? "kB" : filesizeSymbols[standard][e];
  }
  if (neg) number = -number;
  return `${numberFormatter(lang).format(number)} ${unit}`;
};

/** "~1.2K" style estimates, matching bitmagnet's sig-fig rounding. */
export const formatIntEstimate = (
  value: number,
  lang: string,
  isEstimate = true,
  sigFigs = 2,
): string => {
  let n = value;
  if (isEstimate && n > 0 && sigFigs > 0) {
    const magnitude = Math.floor(Math.log10(Math.abs(n)));
    const scale = Math.pow(10, magnitude - (sigFigs - 1));
    n = Math.round(n / scale) * scale;
  }
  const formatted = numberFormatter(lang).format(n);
  return isEstimate ? `~${formatted}` : formatted;
};

export const formatTimeAgo = (value: DateType, lang: string): string =>
  formatDistanceToNow(value, {
    addSuffix: true,
    locale: resolveDateLocale(lang),
  });

export const formatDuration = (duration: Duration, lang: string): string =>
  formatDateFnsDuration(duration, { locale: resolveDateLocale(lang) });

/** Parses ISO-8601 durations such as PT15M (the metric resolution inputs). */
export function parseIsoDuration(durationString: string): Duration {
  const numbers = "\\d+";
  const fractionalNumbers = `${numbers}(?:[\\.,]${numbers})?`;
  const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}W)?(${numbers}D)?`;
  const timePattern = `T(${fractionalNumbers}H)?(${fractionalNumbers}M)?(${fractionalNumbers}S)?`;
  const matches = durationString
    .replace(/,/g, ".")
    .match(new RegExp(`P(?:${datePattern}(?:${timePattern})?)`));
  if (!matches) throw new RangeError(`invalid duration: ${durationString}`);
  const sliced = matches.slice(1);
  if (sliced.filter((v) => v != null).length === 0) {
    throw new RangeError(`invalid duration: ${durationString}`);
  }
  const keys = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
  ] as const;
  const result: Duration = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  sliced.forEach((value, index) => {
    const key = keys[index];
    if (key) result[key] = parseFloat(value || "0") || 0;
  });
  return result;
}
