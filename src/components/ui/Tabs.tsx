import { For, Show } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Icon } from "./Icon";

export type TabItem = {
  key: string;
  label: JSX.Element;
  icon?: string;
  disabled?: boolean;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  onClose?: () => void;
  class?: string;
};

export function Tabs(props: TabsProps) {
  return (
    <div class={["tabs", props.class]} role="tablist">
      <For each={props.items}>
        {(item) => (
          <button
            type="button"
            role="tab"
            class={["tab", { active: item.key === props.value }]}
            aria-selected={item.key === props.value ? "true" : "false"}
            disabled={item.disabled}
            onClick={() => props.onChange(item.key)}
          >
            <Show when={item.icon}>{(icon) => <Icon name={icon()} />}</Show>
            <span class="tab-label">{item.label}</span>
          </button>
        )}
      </For>
      <Show when={props.onClose}>
        <button
          type="button"
          class="tab tab-close"
          aria-label="Close"
          onClick={() => props.onClose?.()}
        >
          <Icon name="close" />
        </button>
      </Show>
    </div>
  );
}

export type TabLink = {
  key: string;
  href: string;
  label: JSX.Element;
  icon?: string;
  active: boolean;
};

export function TabNav(props: {
  links: TabLink[];
  title?: JSX.Element;
  class?: string;
}) {
  return (
    <nav class={["tab-nav", props.class]}>
      <Show when={props.title}>
        <span class="tab-nav-title">{props.title}</span>
      </Show>
      <For each={props.links}>
        {(link) => (
          <a
            class={["tab", { active: link.active }]}
            href={link.href}
            aria-current={link.active ? "page" : undefined}
          >
            <Show when={link.icon}>{(icon) => <Icon name={icon()} />}</Show>
            <span class="tab-label">{link.label}</span>
          </a>
        )}
      </For>
    </nav>
  );
}
