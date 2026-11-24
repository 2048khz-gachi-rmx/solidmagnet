import { createContext, createSignal, useContext, For } from "solid-js";
import type { JSX } from "@solidjs/web";
import { useI18n } from "~/lib/i18n/I18nProvider";

type Notice = {
  id: number;
  message: string;
  kind: "error" | "info";
};

type NotifyApi = {
  error: (message: string, expiryMs?: number) => void;
  info: (message: string, expiryMs?: number) => void;
};

const NotifyContext = createContext<NotifyApi>();

const defaultExpiry = 10_000;

export function NotifyProvider(props: { children?: JSX.Element }) {
  const { t } = useI18n();
  const [notices, setNotices] = createSignal<Notice[]>([]);
  let nextId = 0;

  const dismiss = (id: number) =>
    setNotices((current) => current.filter((notice) => notice.id !== id));

  const push = (
    message: string,
    kind: Notice["kind"],
    expiryMs = defaultExpiry,
  ) => {
    const id = ++nextId;
    setNotices((current) => [...current, { id, message, kind }]);
    window.setTimeout(() => dismiss(id), expiryMs);
  };

  const api: NotifyApi = {
    error: (message, expiryMs) => push(message, "error", expiryMs),
    info: (message, expiryMs) => push(message, "info", expiryMs),
  };

  return (
    <NotifyContext value={api}>
      {props.children}
      <div class="toast-stack" role="status" aria-live="polite">
        <For each={notices()}>
          {(notice) => (
            <div class={`toast toast-${notice.kind}`}>
              <span>{notice.message}</span>
              <button
                type="button"
                class="toast-dismiss"
                onClick={() => dismiss(notice.id)}
              >
                {t("general.dismiss")}
              </button>
            </div>
          )}
        </For>
      </div>
    </NotifyContext>
  );
}

export function useNotify() {
  return useContext(NotifyContext);
}
