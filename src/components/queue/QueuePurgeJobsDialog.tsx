import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { graphqlRequest } from "~/lib/graphql/client";
import { QueuePurgeJobsDocument } from "~/lib/graphql/generated";
import type { QueueJobStatus } from "~/lib/graphql/schema-types";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useNotify } from "~/lib/notify/NotifyProvider";
import { Button } from "~/components/ui/Button";
import { Checkbox } from "~/components/ui/Field";
import { Spinner } from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { availableQueueNames, statusNames } from "./queue.constants";

type Stage = "PENDING" | "REQUESTING" | "DONE";

type QueuePurgeJobsDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function QueuePurgeJobsDialog(props: QueuePurgeJobsDialogProps) {
  const { t } = useI18n();
  const notify = useNotify();
  const [stage, setStage] = createSignal<Stage>("PENDING");
  const [queues, setQueues] = createSignal<string[] | undefined>(undefined);
  const [statuses, setStatuses] = createSignal<QueueJobStatus[] | undefined>(
    undefined,
  );
  const [error, setError] = createSignal<string | undefined>(undefined);

  createEffect(
    () => props.open,
    (open) => {
      if (!open) {
        return;
      }
      setStage("PENDING");
      setQueues(undefined);
      setStatuses(undefined);
      setError(undefined);
    },
  );

  const toggleQueue = (queue: string, checked: boolean) => {
    if (!checked) {
      const next = (queues() ?? []).filter((entry) => entry !== queue);
      setQueues(next.length ? next : undefined);
      return;
    }
    const next = Array.from(new Set([...(queues() ?? []), queue]));
    setQueues(next.length === availableQueueNames.length ? undefined : next);
  };

  const toggleStatus = (status: QueueJobStatus, checked: boolean) => {
    if (!checked) {
      const next = (statuses() ?? []).filter((entry) => entry !== status);
      setStatuses(next.length ? next : undefined);
      return;
    }
    const next = Array.from(new Set([...(statuses() ?? []), status]));
    setStatuses(next.length === statusNames.length ? undefined : next);
  };

  const handlePurgeJobs = async () => {
    if (stage() !== "PENDING") {
      return;
    }
    setStage("REQUESTING");
    try {
      await graphqlRequest(QueuePurgeJobsDocument, {
        input: {
          queues: queues(),
          statuses: statuses(),
        },
      });
      setStage("DONE");
      notify.info(t("dashboard.queues.queue_purged"));
    } catch (err) {
      setStage("DONE");
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      notify.error(message);
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={() => props.onClose()}
      class="queue-dialog"
      title={t("dashboard.queues.purge_queue_jobs")}
      actions={
        <>
          <Button
            variant="warning"
            disabled={stage() !== "PENDING"}
            onClick={() => void handlePurgeJobs()}
          >
            {t("dashboard.queues.purge_jobs")}
          </Button>
          <Button variant="stroked" onClick={() => props.onClose()}>
            {t("general.dismiss")}
          </Button>
        </>
      }
    >
      <Switch>
        <Match when={stage() === "PENDING"}>
          <section class="queue-dialog-section">
            <h4>{t("dashboard.queues.queues")}:</h4>
            <Checkbox
              checked={queues() === undefined}
              label={t("general.all")}
              onChange={() => setQueues(undefined)}
            />
            <For each={availableQueueNames}>
              {(queue) => (
                <Checkbox
                  checked={queues()?.includes(queue) ?? false}
                  label={queue}
                  onChange={(checked) => toggleQueue(queue, checked)}
                />
              )}
            </For>
          </section>
          <section class="queue-dialog-section">
            <h4>{t("general.status")}:</h4>
            <Checkbox
              checked={statuses() === undefined}
              label={t("general.all")}
              onChange={() => setStatuses(undefined)}
            />
            <For each={statusNames}>
              {(status) => (
                <Checkbox
                  checked={statuses()?.includes(status) ?? false}
                  label={t(`dashboard.queues.${status}`)}
                  onChange={(checked) => toggleStatus(status, checked)}
                />
              )}
            </For>
          </section>
        </Match>
        <Match when={stage() === "REQUESTING"}>
          <Spinner />
        </Match>
        <Match when={stage() === "DONE"}>
          <Show
            when={error()}
            fallback={<p>{t("dashboard.queues.queue_purged")}</p>}
          >
            {(message) => (
              <p>
                {t("general.error")}: {message()}
              </p>
            )}
          </Show>
        </Match>
      </Switch>
    </Modal>
  );
}
