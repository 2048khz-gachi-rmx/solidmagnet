import type { JSX } from "@solidjs/web";

type ExpansionPanelProps = {
  title: JSX.Element;
  icon?: string;
  open: boolean;
  onToggle: (open: boolean) => void;
  class?: string;
  children?: JSX.Element;
};

/**
 * Native <details> disclosure. `open` is driven by the caller so that URL
 * state and panel state stay in sync; `onToggle` reports user interaction.
 */
export function ExpansionPanel(props: ExpansionPanelProps) {
  return (
    <details
      class={["expansion", props.class]}
      open={props.open}
      onToggle={(event) => {
        const open = event.currentTarget.open;
        if (open !== props.open) props.onToggle(open);
      }}
    >
      <summary class="expansion-header">
        <span class="expansion-title">
          {props.icon && (
            <span class="icon material-symbols-outlined">{props.icon}</span>
          )}
          {props.title}
        </span>
        <span class="icon material-symbols-outlined expansion-chevron">
          expand_more
        </span>
      </summary>
      <div class="expansion-body">{props.children}</div>
    </details>
  );
}
