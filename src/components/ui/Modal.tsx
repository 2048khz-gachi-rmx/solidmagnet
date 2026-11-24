import { createEffect } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Portal } from "@solidjs/web";

type ModalProps = {
  open: boolean;
  title?: JSX.Element;
  children?: JSX.Element;
  actions?: JSX.Element;
  class?: string;
  onClose: () => void;
};

/** Native modal <dialog>, rendered into the top layer. */
export function Modal(props: ModalProps) {
  let ref!: HTMLDialogElement;

  createEffect(
    () => props.open,
    (open) => {
      if (open) {
        if (!ref.open) ref.showModal();
      } else if (ref.open) {
        ref.close();
      }
    },
  );

  return (
    <Portal mount={document.body}>
      <dialog
        ref={ref}
        class={["modal", props.class]}
        onClose={() => props.onClose()}
        onClick={(event) => {
          if (event.target === ref) props.onClose();
        }}
      >
        <div class="modal-surface">
          {props.title != null && <h2 class="modal-title">{props.title}</h2>}
          <div class="modal-content">{props.children}</div>
          {props.actions != null && (
            <div class="modal-actions">{props.actions}</div>
          )}
        </div>
      </dialog>
    </Portal>
  );
}
