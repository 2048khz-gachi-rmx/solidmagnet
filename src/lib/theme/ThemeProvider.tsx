import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onSettled,
  useContext,
  type Accessor,
} from "solid-js";
import type { JSX } from "@solidjs/web";
import {
  defaultDarkTheme,
  defaultLightTheme,
  themes,
  themeList,
  type ThemeColors,
  type ThemeKey,
} from "./themes";

const STORAGE_KEY = "bitmagnet-theme";

type ThemeSelection = ThemeKey | "auto";

type ThemeContextValue = {
  /** The theme actually in effect (auto resolved). */
  theme: Accessor<ThemeKey>;
  /** The stored selection; "auto" follows the OS preference. */
  selection: Accessor<ThemeSelection>;
  setTheme: (theme: ThemeSelection) => void;
  colors: Accessor<ThemeColors>;
  isDark: Accessor<boolean>;
  availableThemes: typeof themeList;
};

const ThemeContext = createContext<ThemeContextValue>();

const prefersDark = () => {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  return media?.matches ?? false;
};

const readStoredTheme = (): ThemeSelection => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value && value in themes) return value as ThemeKey;
  } catch {
    // storage can be unavailable; fall through to auto
  }
  return "auto";
};

const toCssVariable = (key: string) =>
  `--color-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

export function applyTheme(key: ThemeKey) {
  const theme = themes[key];
  const root = document.documentElement;
  for (const [name, value] of Object.entries(theme.colors)) {
    if (Array.isArray(value)) {
      value.forEach((entry, index) =>
        root.style.setProperty(`--chart-color-${index + 1}`, entry),
      );
    } else {
      root.style.setProperty(toCssVariable(name), value);
    }
  }
  root.dataset.bitmagnetTheme = key;
  root.style.colorScheme = theme.dark ? "dark" : "light";
}

export function ThemeProvider(props: { children?: JSX.Element }) {
  const [selection, setSelection] =
    createSignal<ThemeSelection>(readStoredTheme());
  const [systemDark, setSystemDark] = createSignal(prefersDark());

  const theme = createMemo<ThemeKey>(() => {
    const selected = selection();
    if (selected !== "auto") return selected;
    return systemDark() ? defaultDarkTheme : defaultLightTheme;
  });

  const colors = createMemo(() => themes[theme()].colors);
  const isDark = createMemo(() => themes[theme()].dark);

  createEffect(
    () => theme(),
    (key) => applyTheme(key),
  );

  onSettled(() => {
    const media = window.matchMedia?.(`(prefers-color-scheme: dark)`);
    if (!media) return;
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  });

  const setTheme = (next: ThemeSelection) => {
    setSelection(next);
    try {
      if (next === "auto") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage can be unavailable; the selection still applies for the session
    }
  };

  return (
    <ThemeContext
      value={{
        theme,
        selection,
        setTheme,
        colors,
        isDark,
        availableThemes: themeList,
      }}
    >
      {props.children}
    </ThemeContext>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
