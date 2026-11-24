import { createSignal, Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card, CardActions, CardContent } from "~/components/ui/Card";
import { Checkbox } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { graphqlRequest } from "~/lib/graphql/client";
import { TorrentReprocessDocument } from "~/lib/graphql/generated";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useNotify } from "~/lib/notify/NotifyProvider";
import { errorMessage } from "./util";

type TorrentReprocessProps = {
  infoHashes: string[];
  onUpdated: () => void;
};

export function TorrentReprocess(props: TorrentReprocessProps) {
  const { t } = useI18n();
  const notify = useNotify();

  const [localSearchDisabled, setLocalSearchDisabled] = createSignal(true);
  const [apisDisabled, setApisDisabled] = createSignal(true);
  const [classifierRematch, setClassifierRematch] = createSignal(false);
  const [running, setRunning] = createSignal(false);

  const reprocess = async () => {
    setRunning(true);
    try {
      await graphqlRequest(TorrentReprocessDocument, {
        input: {
          infoHashes: props.infoHashes,
          classifierRematch: classifierRematch(),
          apisDisabled: apisDisabled(),
          localSearchDisabled: localSearchDisabled(),
        },
      });
      props.onUpdated();
    } catch (error) {
      notify.error(`Error reprocessing torrents: ${errorMessage(error)}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card class="reprocess-card">
      <CardContent>
        <div class="reprocess-options">
          <Checkbox
            checked={!localSearchDisabled()}
            label={t("torrents.reprocess.match_content_by_local_search")}
            onChange={(checked) => {
              setLocalSearchDisabled(!checked);
              if (!checked) setApisDisabled(true);
            }}
          />
          <Checkbox
            checked={!apisDisabled()}
            label={t("torrents.reprocess.match_content_by_external_api_search")}
            onChange={(checked) => {
              setApisDisabled(!checked);
              if (checked) setLocalSearchDisabled(false);
            }}
          />
          <Checkbox
            checked={classifierRematch()}
            label={t("torrents.reprocess.force_rematch")}
            onChange={setClassifierRematch}
          />
        </div>
      </CardContent>
      <CardActions class="button-row">
        <Button
          variant="stroked"
          disabled={!props.infoHashes.length || running()}
          onClick={() => void reprocess()}
        >
          <Show when={running()} fallback={<Icon name="cycle" />}>
            <Icon name="progress_activity" />
          </Show>
          {t("torrents.reprocess.reprocess")}
        </Button>
      </CardActions>
    </Card>
  );
}
