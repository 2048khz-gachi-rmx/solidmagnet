import { createEffect, createSignal, For, Match, Switch } from "solid-js";
import { graphqlRequest } from "~/lib/graphql/client";
import { QueueEnqueueReprocessTorrentsBatchDocument } from "~/lib/graphql/generated";
import type { ContentType } from "~/lib/graphql/schema-types";
import { contentTypeList } from "~/lib/content-types";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useNotify } from "~/lib/notify/NotifyProvider";
import { Button } from "~/components/ui/Button";
import { Checkbox } from "~/components/ui/Field";
import { Spinner } from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";

type Stage = "PENDING" | "REQUESTING" | "DONE";

type ContentTypeSelection = ContentType | "null" | "all";

type QueueEnqueueReprocessTorrentsBatchDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function QueueEnqueueReprocessTorrentsBatchDialog(
  props: QueueEnqueueReprocessTorrentsBatchDialogProps,
) {
  const { t } = useI18n();
  const notify = useNotify();
  const [stage, setStage] = createSignal<Stage>("PENDING");
  const [purge, setPurge] = createSignal(true);
  const [apisDisabled, setApisDisabled] = createSignal(true);
  const [localSearchDisabled, setLocalSearchDisabled] = createSignal(true);
  const [classifierRematch, setClassifierRematch] = createSignal(false);
  const [contentTypes, setContentTypes] = createSignal<ContentTypeSelection[]>([
    "all",
  ]);
  const [orphans, setOrphans] = createSignal(false);

  createEffect(
    () => props.open,
    (open) => {
      if (!open) {
        return;
      }
      setStage("PENDING");
      setPurge(true);
      setApisDisabled(true);
      setLocalSearchDisabled(true);
      setClassifierRematch(false);
      setContentTypes(["all"]);
      setOrphans(false);
    },
  );

  const onContentTypeSelectionChange = (values: string[]) => {
    if (
      !values.length ||
      (values.includes("all") &&
        (!contentTypes().includes("all") || values.length === 1))
    ) {
      setContentTypes(["all"]);
      return;
    }
    setOrphans(false);
    setContentTypes(
      contentTypeList
        .map((contentType) => contentType.key)
        .filter((key) => values.includes(key)),
    );
  };

  const handleEnqueue = async () => {
    if (stage() !== "PENDING") {
      return;
    }
    setStage("REQUESTING");
    try {
      await graphqlRequest(QueueEnqueueReprocessTorrentsBatchDocument, {
        input: {
          purge: purge(),
          apisDisabled: apisDisabled(),
          localSearchDisabled: localSearchDisabled(),
          classifierRematch: classifierRematch(),
          contentTypes: contentTypes().includes("all")
            ? undefined
            : contentTypes().map((contentType) =>
                contentType === "null" ? null : (contentType as ContentType),
              ),
          orphans: orphans() ? true : undefined,
        },
      });
      setStage("DONE");
      notify.info(t("dashboard.queues.jobs_enqueued"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notify.error(message);
      setStage("PENDING");
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={() => props.onClose()}
      class="queue-dialog"
      title={t("dashboard.queues.enqueue_torrent_processing_batch")}
      actions={
        <>
          <Button
            variant="warning"
            disabled={stage() !== "PENDING"}
            onClick={() => void handleEnqueue()}
          >
            {t("dashboard.queues.enqueue_jobs")}
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
            <Checkbox
              checked={purge()}
              label={t("dashboard.queues.purge_queue_jobs")}
              onChange={(checked) => setPurge(checked)}
            />
            <Checkbox
              checked={!localSearchDisabled()}
              label={t("torrents.reprocess.match_content_by_local_search")}
              onChange={(checked) => {
                setLocalSearchDisabled(!checked);
                if (!checked) {
                  setApisDisabled(true);
                }
              }}
            />
            <Checkbox
              checked={!apisDisabled()}
              label={t(
                "torrents.reprocess.match_content_by_external_api_search",
              )}
              onChange={(checked) => setApisDisabled(!checked)}
            />
            <Checkbox
              checked={classifierRematch()}
              label={t("torrents.reprocess.force_rematch")}
              onChange={(checked) => setClassifierRematch(checked)}
            />
            <Checkbox
              checked={orphans()}
              label={t("dashboard.queues.process_orphaned_torrents_only")}
              onChange={(checked) => {
                setOrphans(checked);
                if (checked) {
                  setContentTypes(["all"]);
                }
              }}
            />
            <label class="field queue-content-types">
              <span class="field-label">{t("facets.content_type")}</span>
              <select
                class="field-input"
                multiple
                size={5}
                aria-label={t("facets.content_type")}
                onChange={(event) =>
                  onContentTypeSelectionChange(
                    Array.from(
                      event.currentTarget.selectedOptions,
                      (option) => option.value,
                    ),
                  )
                }
              >
                <option value="all" selected={contentTypes().includes("all")}>
                  {t("general.all")}
                </option>
                <For each={contentTypeList}>
                  {(contentType) => (
                    <option
                      value={contentType.key}
                      selected={contentTypes().includes(contentType.key)}
                    >
                      {t(`content_types.plural.${contentType.key}`)}
                    </option>
                  )}
                </For>
              </select>
            </label>
          </section>
        </Match>
        <Match when={stage() === "REQUESTING"}>
          <Spinner />
        </Match>
        <Match when={stage() === "DONE"}>
          <p>{t("dashboard.queues.jobs_enqueued")}</p>
        </Match>
      </Switch>
    </Modal>
  );
}
