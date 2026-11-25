import { For, Show } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Icon } from "./Icon";

export type ChipItem = {
  key: string;
  label: JSX.Element;
  icon?: string;
  variant?: "primary";
  onRemove?: () => void;
};

export function Chips(props: { items: ChipItem[]; class?: string }) {
  const title = (item: ChipItem) =>
    typeof item.label === "string" ? item.label : undefined;

  return (
    <div class={["chip-set", props.class]}>
      {/* Chips keep their identity across refreshed torrent data. */}
      <For each={props.items} keyed={(item) => item.key}>
        {(item) => (
          <span
            class={["chip", { "chip-primary": item().variant === "primary" }]}
            title={title(item())}
          >
            <Show when={item().icon}>
              {(icon) => <Icon name={icon()} class="chip-icon" />}
            </Show>
            <span class="chip-label">{item().label}</span>
            <Show when={item().onRemove}>
              <button
                type="button"
                class="chip-remove"
                aria-label="Remove"
                onClick={() => item().onRemove?.()}
              >
                <Icon name="cancel" />
              </button>
            </Show>
          </span>
        )}
      </For>
    </div>
  );
}
