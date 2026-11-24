import { Show } from "solid-js";
import type { JSX } from "@solidjs/web";

type CardProps = {
  children?: JSX.Element;
  class?: string;
};

export function Card(props: CardProps) {
  return <div class={["card", props.class]}>{props.children}</div>;
}

export function CardHeader(props: CardProps) {
  return <div class={["card-header", props.class]}>{props.children}</div>;
}

export function CardTitle(props: CardProps) {
  return <h2 class={["card-title", props.class]}>{props.children}</h2>;
}

export function CardContent(props: CardProps) {
  return <div class={["card-content", props.class]}>{props.children}</div>;
}

export function CardActions(props: CardProps) {
  return <div class={["card-actions", props.class]}>{props.children}</div>;
}

export function Divider(props: { class?: string }) {
  return <hr class={["divider", props.class]} />;
}

type ProgressBarProps = {
  value?: number;
  indeterminate?: boolean;
  class?: string;
};

export function ProgressBar(props: ProgressBarProps) {
  return (
    <div class={["progress-bar", props.class]}>
      <Show
        when={!props.indeterminate}
        fallback={<div class="progress-indeterminate" />}
      >
        <div
          class="progress-value"
          style={{ width: `${Math.min(100, Math.max(0, props.value ?? 0))}%` }}
        />
      </Show>
    </div>
  );
}

export function ProgressBarContainer(props: { children?: JSX.Element }) {
  return <div class="progress-bar-container">{props.children}</div>;
}

export function Spinner(props: { size?: number }) {
  return (
    <span
      class="spinner"
      role="progressbar"
      aria-label="Loading"
      style={
        props.size
          ? { width: `${props.size}px`, height: `${props.size}px` }
          : undefined
      }
    />
  );
}

export function Badge(props: { children?: JSX.Element; class?: string }) {
  return <span class={["badge", props.class]}>{props.children}</span>;
}
