import { createUniqueId, Show } from "solid-js";
import type { JSX } from "@solidjs/web";

type MenuProps = {
  label: string;
  trigger: JSX.Element;
  align?: "start" | "end";
  class?: string;
  children?: JSX.Element;
};

/**
 * A native popover menu: outside clicks and Escape are handled by the browser.
 * The trigger and panel are tied together with CSS anchor positioning.
 */
export function Menu(props: MenuProps) {
  const id = createUniqueId();
  const anchor = `--menu-${id}`;
  let panel!: HTMLDivElement;

  return (
    <div class={["menu-root", props.class]}>
      <button
        type="button"
        class="btn btn-icon"
        title={props.label}
        aria-label={props.label}
        popovertarget={id}
        style={{ "anchor-name": anchor }}
      >
        {props.trigger}
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        class={["menu-panel", `menu-align-${props.align ?? "start"}`]}
        // eslint-disable-next-line solid/style-prop -- valid CSS anchor positioning
        style={{ "position-anchor": anchor }}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("a, button")) panel.hidePopover();
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

type MenuItemProps = {
  href?: string;
  target?: string;
  active?: boolean;
  onClick?: () => void;
  children?: JSX.Element;
};

export function MenuItem(props: MenuItemProps) {
  const classes = () => ["menu-item", { active: props.active }];
  return (
    <Show
      when={props.href}
      fallback={
        <button
          type="button"
          class={classes()}
          onClick={() => props.onClick?.()}
        >
          {props.children}
        </button>
      }
    >
      {(href: () => string) => (
        <a
          class={classes()}
          href={href()}
          target={props.target}
          rel={props.target === "_blank" ? "noreferrer" : undefined}
          onClick={() => props.onClick?.()}
        >
          {props.children}
        </a>
      )}
    </Show>
  );
}
