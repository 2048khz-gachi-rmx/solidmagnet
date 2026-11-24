import { Show } from "solid-js";
import type { JSX } from "@solidjs/web";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  children?: JSX.Element;
  class?: string;
};

/**
 * Responsive sidebar. From 960px up it is a permanent column; below that it
 * slides over the content with a backdrop.
 */
export function Sidebar(props: SidebarProps) {
  return (
    <>
      <aside class={["sidebar", { open: props.open }, props.class]}>
        {props.children}
      </aside>
      <Show when={props.open}>
        <div
          class="sidebar-backdrop"
          onClick={() => props.onClose()}
          aria-hidden="true"
        />
      </Show>
    </>
  );
}

type DrawerLayoutProps = {
  children?: JSX.Element;
  sidebar: JSX.Element;
  class?: string;
};

export function DrawerLayout(props: DrawerLayoutProps) {
  return (
    <div class={["drawer-layout", props.class]}>
      {props.sidebar}
      <div class="drawer-content">{props.children}</div>
    </div>
  );
}
