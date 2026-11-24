export type ThemeType = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderSubtle: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  tertiary: string;
  error: string;
  onError: string;
  success: string;
  caution: string;
  link: string;
  hover: string;
  selected: string;
  toolbarBackground: string;
  toolbarText: string;
  toolbarActiveBackground: string;
  toolbarActiveText: string;
  tableHeader: string;
  chartGrid: string;
  chartPalette: string[];
};

export type ThemeDefinition = {
  key: ThemeKey;
  label: string;
  dark: boolean;
  colors: ThemeColors;
};

export const themeKeys = ["classic", "clean", "neon", "tundra"] as const;
export type ThemeKey = (typeof themeKeys)[number];

export const defaultLightTheme = "classic";
export const defaultDarkTheme = "tundra";

export const themes: Record<ThemeKey, ThemeDefinition> = {
  classic: {
    key: "classic",
    label: "Classic",
    dark: false,
    colors: {
      background: "#fbf8fd",
      surface: "#fbf8fd",
      surfaceAlt: "#f3f0f4",
      surfaceRaised: "#ffffff",
      text: "#1b1b1f",
      textMuted: "#5d5e67",
      textSubtle: "#767680",
      border: "#c7c5d0",
      borderSubtle: "#e4e1e6",
      primary: "#4355b9",
      onPrimary: "#ffffff",
      primaryContainer: "#dee0ff",
      onPrimaryContainer: "#00105c",
      secondary: "#bc004b",
      onSecondary: "#ffffff",
      tertiary: "#77536d",
      error: "#ba1a1a",
      onError: "#ffffff",
      success: "#006e1c",
      caution: "#964900",
      link: "#bc004b",
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(67, 85, 185, 0.12)",
      toolbarBackground: "#4355b9",
      toolbarText: "#ffffff",
      toolbarActiveBackground: "rgba(255, 255, 255, 0.8)",
      toolbarActiveText: "#4355b9",
      tableHeader: "#f3f0f4",
      chartGrid: "#c8c5ca",
      chartPalette: [
        "#4355b9",
        "#bc004b",
        "#77536d",
        "#ba1a1a",
        "#964900",
        "#006e1c",
      ],
    },
  },
  clean: {
    key: "clean",
    label: "Clean",
    dark: false,
    colors: {
      background: "#fbf8fd",
      surface: "#f3f0f4",
      surfaceAlt: "#f0edf1",
      surfaceRaised: "#ffffff",
      text: "#1b1b1f",
      textMuted: "#5d5e67",
      textSubtle: "#767680",
      border: "#c7c5d0",
      borderSubtle: "#e4e1e6",
      primary: "#4355b9",
      onPrimary: "#ffffff",
      primaryContainer: "#dee0ff",
      onPrimaryContainer: "#00105c",
      secondary: "#bc004b",
      onSecondary: "#ffffff",
      tertiary: "#77536d",
      error: "#ba1a1a",
      onError: "#ffffff",
      success: "#006e1c",
      caution: "#964900",
      link: "#bc004b",
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(67, 85, 185, 0.12)",
      toolbarBackground: "#f3f0f4",
      toolbarText: "#1b1b1f",
      toolbarActiveBackground: "#eae7ec",
      toolbarActiveText: "#4355b9",
      tableHeader: "#eae7ec",
      chartGrid: "#c8c5ca",
      chartPalette: [
        "#4355b9",
        "#bc004b",
        "#77536d",
        "#ba1a1a",
        "#964900",
        "#006e1c",
      ],
    },
  },
  neon: {
    key: "neon",
    label: "Neon",
    dark: true,
    colors: {
      background: "#0c0f10",
      surface: "#191c1e",
      surfaceAlt: "#2e3132",
      surfaceRaised: "#202325",
      text: "#e1e2e4",
      textMuted: "#a9abad",
      textSubtle: "#8f9193",
      border: "#586064",
      borderSubtle: "#2a3236",
      primary: "#ff00ff",
      onPrimary: "#0c0f10",
      primaryContainer: "#4d004d",
      onPrimaryContainer: "#ffccff",
      secondary: "#28bd28",
      onSecondary: "#0c0f10",
      tertiary: "#00b3ff",
      error: "#ff3333",
      onError: "#0c0f10",
      success: "#00cc00",
      caution: "#ffc300",
      link: "#8bff61",
      hover: "rgba(255, 255, 255, 0.06)",
      selected: "rgba(255, 0, 255, 0.18)",
      toolbarBackground: "#ff00ff",
      toolbarText: "#0c0f10",
      toolbarActiveBackground: "#0c0f10",
      toolbarActiveText: "#ff00ff",
      tableHeader: "#2a3236",
      chartGrid: "#505355",
      chartPalette: [
        "#ff00ff",
        "#3dff14",
        "#00b3ff",
        "#ff3333",
        "#ffc300",
        "#00cc00",
      ],
    },
  },
  tundra: {
    key: "tundra",
    label: "Tundra",
    dark: true,
    colors: {
      background: "#0d0f19",
      surface: "#141726",
      surfaceAlt: "#222744",
      surfaceRaised: "#1a1e33",
      text: "#e1e2e4",
      textMuted: "#a9abad",
      textSubtle: "#8f9193",
      border: "#586064",
      borderSubtle: "#2a3236",
      primary: "#8591cd",
      onPrimary: "#0d0f19",
      primaryContainer: "#2b3056",
      onPrimaryContainer: "#c1c1eb",
      secondary: "#b3b355",
      onSecondary: "#0d0f19",
      tertiary: "#c6c2ea",
      error: "#ffb4ab",
      onError: "#0d0f19",
      success: "#78dc77",
      caution: "#ffb787",
      link: "#b3b355",
      hover: "rgba(255, 255, 255, 0.06)",
      selected: "rgba(133, 145, 205, 0.2)",
      toolbarBackground: "#222744",
      toolbarText: "#e1e2e4",
      toolbarActiveBackground: "#0d0f19",
      toolbarActiveText: "#c1c1eb",
      tableHeader: "#222744",
      chartGrid: "#505355",
      chartPalette: [
        "#8591cd",
        "#b3b355",
        "#c6c2ea",
        "#ffb4ab",
        "#ffb787",
        "#78dc77",
      ],
    },
  },
};

export const themeList = themeKeys.map((key) => themes[key]);
