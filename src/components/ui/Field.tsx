import { createEffect, For, Show } from "solid-js";
import type { JSX } from "@solidjs/web";

type TextInputProps = {
  value?: string;
  placeholder?: string;
  label?: string;
  type?: "text" | "number" | "search";
  min?: number;
  class?: string;
  disabled?: boolean;
  autofocus?: boolean;
  ariaLabel?: string;
  onInput?: (value: string) => void;
  onEnter?: (value: string) => void;
};

export function TextInput(props: TextInputProps) {
  return (
    <label class={["field", props.class]}>
      <Show when={props.label}>
        <span class="field-label">{props.label}</span>
      </Show>
      <input
        class="field-input"
        type={props.type ?? "text"}
        min={props.min}
        value={props.value ?? ""}
        placeholder={props.placeholder}
        disabled={props.disabled}
        autofocus={props.autofocus}
        aria-label={props.ariaLabel ?? props.label}
        onInput={(event) => props.onInput?.(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") props.onEnter?.(event.currentTarget.value);
        }}
      />
    </label>
  );
}

type NumberInputProps = {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  class?: string;
  ariaLabel?: string;
  onInput?: (value: number) => void;
};

export function NumberInput(props: NumberInputProps) {
  return (
    <label class={["field", props.class]}>
      <Show when={props.label}>
        <span class="field-label">{props.label}</span>
      </Show>
      <input
        class="field-input"
        type="number"
        value={props.value ?? 0}
        min={props.min}
        max={props.max}
        aria-label={props.ariaLabel ?? props.label}
        onInput={(event) => props.onInput?.(event.currentTarget.valueAsNumber)}
      />
    </label>
  );
}

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type SelectProps<T extends string | number> = {
  value: T;
  options: SelectOption<T>[];
  label?: string;
  class?: string;
  ariaLabel?: string;
  disabled?: boolean;
  onChange: (value: T) => void;
};

export function Select<T extends string | number>(props: SelectProps<T>) {
  return (
    <label class={["field", props.class]}>
      <Show when={props.label}>
        <span class="field-label">{props.label}</span>
      </Show>
      <select
        class="field-input field-select"
        aria-label={props.ariaLabel ?? props.label}
        disabled={props.disabled}
        onChange={(event) => {
          const option = props.options.find(
            (candidate) =>
              String(candidate.value) === event.currentTarget.value,
          );
          if (option) props.onChange(option.value);
        }}
      >
        <For each={props.options} keyed={(option) => option.value}>
          {(option) => (
            <option
              value={String(option().value)}
              selected={option().value === props.value}
              disabled={option().disabled}
            >
              {option().label}
            </option>
          )}
        </For>
      </select>
    </label>
  );
}

type CheckboxProps = {
  checked: boolean;
  label?: JSX.Element;
  disabled?: boolean;
  indeterminate?: boolean;
  class?: string;
  ariaLabel?: string;
  onChange?: (checked: boolean) => void;
};

export function Checkbox(props: CheckboxProps) {
  let ref!: HTMLInputElement;

  createEffect(
    () => props.indeterminate ?? false,
    (indeterminate) => {
      ref.indeterminate = indeterminate;
    },
  );

  return (
    <label class={["checkbox", props.class]}>
      <input
        ref={ref}
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled}
        aria-label={props.ariaLabel}
        onChange={(event) => props.onChange?.(event.currentTarget.checked)}
      />
      <span class="checkbox-box" aria-hidden="true" />
      <Show when={props.label != null}>
        <span class="checkbox-label">{props.label}</span>
      </Show>
    </label>
  );
}

type ButtonGroupProps = {
  children?: JSX.Element;
  class?: string;
};

export function ButtonGroup(props: ButtonGroupProps) {
  return <div class={["button-group", props.class]}>{props.children}</div>;
}
