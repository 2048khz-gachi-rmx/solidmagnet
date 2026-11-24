import { createSignal } from "solid-js";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { QueueEnqueueReprocessTorrentsBatchDialog } from "./QueueEnqueueReprocessTorrentsBatchDialog";
import { QueuePurgeJobsDialog } from "./QueuePurgeJobsDialog";

export function QueueAdmin() {
  const { t } = useI18n();
  const [purgeOpen, setPurgeOpen] = createSignal(false);
  const [enqueueOpen, setEnqueueOpen] = createSignal(false);

  return (
    <Card>
      <CardContent>
        <ul class="queue-admin-list">
          <li>
            <Button onClick={() => setPurgeOpen(true)}>
              {t("dashboard.queues.purge_queue_jobs")}
            </Button>
          </li>
          <li>
            <Button onClick={() => setEnqueueOpen(true)}>
              {t("dashboard.queues.enqueue_torrent_processing_batch")}
            </Button>
          </li>
        </ul>
      </CardContent>
      <QueuePurgeJobsDialog
        open={purgeOpen()}
        onClose={() => setPurgeOpen(false)}
      />
      <QueueEnqueueReprocessTorrentsBatchDialog
        open={enqueueOpen()}
        onClose={() => setEnqueueOpen(false)}
      />
    </Card>
  );
}
