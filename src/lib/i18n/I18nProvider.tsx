import {
  createContext,
  createEffect,
  createSignal,
  useContext,
  type Accessor,
} from "solid-js";
import type { JSX } from "@solidjs/web";
import {
  availableLanguages,
  defaultLanguage,
  isLanguage,
  translate,
  type Language,
  type TranslationParams,
} from "./messages";

const STORAGE_KEY = "bitmagnet-language";

export type Translate = (key: string, params?: TranslationParams) => string;

type I18nContextValue = {
  lang: Accessor<string>;
  setLanguage: (lang: string) => void;
  t: Translate;
  availableLanguages: Language[];
  formatNumber: (value: number) => string;
};

const I18nContext = createContext<I18nContextValue>();

const readStoredLanguage = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // storage can be unavailable
  }
  const navigatorLang = navigator?.language?.split("-")?.[0] ?? undefined;
  return isLanguage(navigatorLang) ? navigatorLang : defaultLanguage;
};

export function I18nProvider(props: { children?: JSX.Element }) {
  const [lang, setLang] = createSignal(readStoredLanguage());

  createEffect(
    () => lang(),
    (current) => {
      document.documentElement.lang = current;
    },
  );

  const setLanguage = (next: string) => {
    if (!isLanguage(next)) return;
    setLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage can be unavailable
    }
  };

  const t: Translate = (key, params) => translate(lang(), key, params);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(lang()).format(value);

  return (
    <I18nContext
      value={{ lang, setLanguage, t, availableLanguages, formatNumber }}
    >
      {props.children}
    </I18nContext>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
