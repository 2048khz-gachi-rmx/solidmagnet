import {
  createContext,
  createSignal,
  onSettled,
  useContext,
  type Accessor,
} from "solid-js";
import type { JSX } from "@solidjs/web";

export const breakpointSizes = [
  "XSmall",
  "Small",
  "Medium",
  "Large",
  "XLarge",
] as const;

export type BreakpointSize = (typeof breakpointSizes)[number];

const mediaQueries: Record<BreakpointSize, string> = {
  XSmall: "(max-width: 599.98px)",
  Small: "(min-width: 600px) and (max-width: 959.98px)",
  Medium: "(min-width: 960px) and (max-width: 1279.98px)",
  Large: "(min-width: 1280px) and (max-width: 1919.98px)",
  XLarge: "(min-width: 1920px)",
};

const detect = (): BreakpointSize => {
  if (typeof window === "undefined") return "Medium";
  for (const size of breakpointSizes) {
    if (window.matchMedia(mediaQueries[size]).matches) return size;
  }
  return "Medium";
};

type BreakpointsContextValue = {
  size: Accessor<BreakpointSize>;
  atLeast: (size: BreakpointSize) => boolean;
};

const BreakpointsContext = createContext<BreakpointsContextValue>();

export function BreakpointsProvider(props: { children?: JSX.Element }) {
  const [size, setSize] = createSignal<BreakpointSize>(detect());

  onSettled(() => {
    const lists = breakpointSizes.map(
      (key) => [key, window.matchMedia(mediaQueries[key])] as const,
    );
    const update = () => {
      const match = lists.find(([, media]) => media.matches);
      if (match) setSize(match[0]);
    };
    lists.forEach(([, media]) => media.addEventListener("change", update));
    return () =>
      lists.forEach(([, media]) => media.removeEventListener("change", update));
  });

  const atLeast = (target: BreakpointSize) =>
    breakpointSizes.indexOf(target) <= breakpointSizes.indexOf(size());

  return (
    <BreakpointsContext value={{ size, atLeast }}>
      {props.children}
    </BreakpointsContext>
  );
}

export function useBreakpoints() {
  return useContext(BreakpointsContext);
}
