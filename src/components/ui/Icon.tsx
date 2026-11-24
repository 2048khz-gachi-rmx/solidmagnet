import type { JSX } from "@solidjs/web";

export type IconName = string;

type IconProps = {
  name: IconName;
  class?: string;
  size?: number;
  title?: string;
};

/** Material Symbols (outlined) glyph. */
export function Icon(props: IconProps) {
  return (
    <span
      class={["icon material-symbols-outlined", props.class]}
      style={props.size ? { "font-size": `${props.size}px` } : undefined}
      title={props.title}
      aria-hidden={props.title ? undefined : "true"}
    >
      {props.name}
    </span>
  );
}

type SvgIconProps = {
  class?: string;
  size?: number;
  title?: string;
};

type SvgRootProps = SvgIconProps & {
  viewBox: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  strokeLinecap?: "round" | "butt" | "square";
  strokeLinejoin?: "round" | "miter" | "bevel";
  children?: JSX.Element;
};

function SvgRoot(props: SvgRootProps) {
  return (
    <svg
      class={["svg-icon", props.class]}
      width={props.size}
      height={props.size}
      viewBox={props.viewBox}
      fill={props.fill}
      stroke={props.stroke}
      stroke-width={props.strokeWidth}
      stroke-linecap={props.strokeLinecap}
      stroke-linejoin={props.strokeLinejoin}
      role={props.title ? "img" : undefined}
      aria-hidden={props.title ? undefined : "true"}
    >
      {props.title && <title>{props.title}</title>}
      {props.children}
    </svg>
  );
}

export function MagnetIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgRoot {...props} viewBox="-20 -20 320 320" fill="currentColor">
      <path d="M67.7 4.23l0 137.76c0,39.62 32.38,71.98 71.99,71.98 39.61,0 71.98,-32.37 71.98,-71.98l0 -137.76c0,-2.33 1.9,-4.23 4.23,-4.23l59.24 0c2.33,0 4.23,1.9 4.23,4.23l0 137.76c0,76.97 -62.71,139.68 -139.68,139.68 -76.98,0 -139.68,-62.7 -139.68,-139.68l0 -137.76c0,-2.33 1.9,-4.23 4.23,-4.23l59.24 0c2.33,0 4.23,1.9 4.23,4.23zm-12.69 8.46l-42.32 0 0 48.15 42.32 0 0 -48.15zm211.66 48.15l0 -48.15 -42.32 0 0 48.15 42.32 0z" />
    </SvgRoot>
  );
}

export function QueueIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgRoot {...props} viewBox="0 0 32 32" fill="currentColor">
      <path d="M28,28H4a2.0021,2.0021,0,0,1-2-2V21H4v5H28V21h2v5A2.0021,2.0021,0,0,1,28,28Z" />
      <rect x="7" y="21" width="18" height="2" />
      <rect x="7" y="16" width="18" height="2" />
      <rect x="7" y="11" width="18" height="2" />
      <rect x="7" y="6" width="18" height="2" />
    </SvgRoot>
  );
}

export function ExternalLinkIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgRoot {...props} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
    </SvgRoot>
  );
}

export function BinaryIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgRoot
      {...props}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    >
      <rect height="4.5" width="3" y="1.75" x="3.25" />
      <path d="m9.75 6.25h3m-3-4.5h1.5v4" />
      <rect height="4.5" width="3" y="9.75" x="9.75" />
      <path d="m3.25 14.25h3m-3-4.5h1.5v4" />
    </SvgRoot>
  );
}
