import { createEffect, createSignal, For, Show } from "solid-js";
import type { QueueJobsQuery } from "~/lib/graphql/generated";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { formatTimeAgo } from "~/lib/format/format";
import { copyToClipboard } from "~/lib/platform/clipboard";

export type QueueJobRow = QueueJobsQuery["queue"]["jobs"]["items"][number];

const columnCount = 7;

const beautifyPayload = (payload: string): string => {
  try {
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch {
    return payload;
  }
};

/** Queue jobs table with expandable payload/error detail rows. */
export function QueueJobsTable(props: { items: QueueJobRow[] }) {
  const { t, lang, formatNumber } = useI18n();
  const [expandedId, setExpandedId] = createSignal<string | null>(null);

  createEffect(
    () => props.items,
    (items) => {
      const id = expandedId();
      if (id && !items.some((item) => item.id === id)) {
        setExpandedId(null);
      }
    },
  );

  const toggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const copy = (event: MouseEvent, text: string) => {
    event.stopPropagation();
    void copyToClipboard(text);
  };

  return (
    <div class="queue-table-wrap">
      <table class="table queue-jobs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th class="queue-col-optional">{t("dashboard.queues.queue")}</th>
            <th>{t("dashboard.queues.priority")}</th>
            <th>{t("general.status")}</th>
            <th class="queue-col-optional">{t("general.error")}</th>
            <th class="queue-col-time">{t("dashboard.queues.created_at")}</th>
            <th class="queue-col-time">{t("dashboard.queues.ran_at")}</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.items}>
            {(item) => (
              <>
                <tr
                  class={[
                    "queue-summary-row",
                    { expanded: expandedId() === item.id },
                  ]}
                  onClick={() => toggle(item.id)}
                >
                  <td class="queue-col-id">{item.id}</td>
                  <td class="queue-col-optional">{item.queue}</td>
                  <td>{formatNumber(item.priority)}</td>
                  <td>
                    <span
                      class={[
                        "chip",
                        "queue-status",
                        `queue-status-${item.status}`,
                      ]}
                    >
                      {t(`dashboard.queues.${item.status}`)}
                    </span>
                  </td>
                  <td class="queue-col-optional">
                    <Show when={item.error}>
                      {(error) => `${error().slice(0, 20)}...`}
                    </Show>
                  </td>
                  <td class="queue-col-time">
                    {formatTimeAgo(item.createdAt, lang())}
                  </td>
                  <td class="queue-col-time">
                    <Show when={item.ranAt}>
                      {(ranAt) => formatTimeAgo(ranAt(), lang())}
                    </Show>
                  </td>
                </tr>
                <Show when={expandedId() === item.id}>
                  <tr class="detail-row">
                    <td colspan={columnCount}>
                      <div class="queue-item-detail">
                        <p>
                          <strong>ID:</strong>&nbsp;
                          <span
                            class="queue-copy"
                            title={t("torrents.copy_to_clipboard")}
                            onClick={(event) => copy(event, item.id)}
                          >
                            {item.id}
                          </span>
                        </p>
                        <h5>
                          <span
                            class="queue-copy"
                            title={t("torrents.copy_to_clipboard")}
                            onClick={(event) => copy(event, item.payload)}
                          >
                            {t("dashboard.queues.payload")}:
                          </span>
                        </h5>
                        <pre class="queue-payload">
                          {beautifyPayload(item.payload)}
                        </pre>
                        <Show when={item.error}>
                          {(error) => (
                            <>
                              <h5>
                                <span
                                  class="queue-copy"
                                  title={t("torrents.copy_to_clipboard")}
                                  onClick={(event) => copy(event, error())}
                                >
                                  {t("general.error")}:
                                </span>
                              </h5>
                              <pre class="queue-payload">{error()}</pre>
                            </>
                          )}
                        </Show>
                      </div>
                    </td>
                  </tr>
                </Show>
              </>
            )}
          </For>
          <Show when={props.items.length === 0}>
            <tr>
              <td colspan={columnCount} class="muted">
                {t("general.none")}
              </td>
            </tr>
          </Show>
        </tbody>
      </table>
    </div>
  );
}
