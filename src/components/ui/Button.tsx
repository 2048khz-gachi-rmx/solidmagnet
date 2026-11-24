import { Show } from "solid-js";
import type { JSX } from "@solidjs/web";

export type ButtonVariant =
  "text" | "stroked" | "icon" | "fab" | "mini-fab" | "warning";

type ButtonProps = {
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  href?: string;
  target?: string;
  title?: string;
  class?: string;
  onClick?: (event: MouseEvent) => void;
  children?: JSX.Element;
};

export function Button(props: ButtonProps) {
  const classes = () => ["btn", `btn-${props.variant ?? "text"}`, props.class];

  return (
    <Show
      when={props.href}
      fallback={
        <button
          type={props.type ?? "button"}
          class={classes()}
          disabled={props.disabled}
          title={props.title}
          onClick={(event) => props.onClick?.(event)}
        >
          {props.children}
        </button>
      }
    >
      {(href) => (
        <a
          class={classes()}
          href={href()}
          target={props.target}
          rel={props.target === "_blank" ? "noreferrer" : undefined}
          title={props.title}
          onClick={(event) => props.onClick?.(event)}
        >
          {props.children}
        </a>
      )}
    </Show>
  );
}

type IconButtonProps = {
  label: string;
  disabled?: boolean;
  class?: string;
  onClick?: (event: MouseEvent) => void;
  children?: JSX.Element;
};

export function IconButton(props: IconButtonProps) {
  return (
    <button
      type="button"
      class={["btn btn-icon", props.class]}
      title={props.label}
      aria-label={props.label}
      disabled={props.disabled}
      onClick={(event) => props.onClick?.(event)}
    >
      {props.children}
    </button>
  );
}
